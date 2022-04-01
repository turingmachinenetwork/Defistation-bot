const logger = global.logger;
const config = global.config;
const Agenda = require("agenda");
const Agendash = require('agendash');

const UpdateTVLToDefistationSchedule = require("./update-tvl-to-defistation.schedule");

const classConstructors = {
    "UpdateTVLToDefistation": UpdateTVLToDefistationSchedule
 };

class SCHEDULE_HELPER {

	constructor() {
        this.agenda = new Agenda( {db: { address: process.env.DB_PATH, collection: 'scheduleJobs', options: { useUnifiedTopology: true } } } );
        this.agenda.defaultLockLifetime(60000);
        this.isAgendaReady = false;
        let self = this;
        this.agenda.on( "ready", async function() {
            self.isAgendaReady = true;
        });
    }

    async start() {
    	if (!this.isAgendaReady) {
            let self = this;
            logger.debug("The agenda is not ready. Wait more 1 second...");
            setTimeout(async function() {
                await self.start();
            }, 1000);
            return;
        }
        logger.debug("The agenda is ready to start");

        await this.agenda.start();
        await this._initJobs();
        logger.info("Agenda has been started!");
	}

	async _initJobs() {
        let jobConfigs = config.jobs;
        let jobTotal = 0;
        let jobSuccess = 0;
        for (let idx=0; idx<jobConfigs.length; idx++) {
            let jobConfig = jobConfigs[idx];
            if (!jobConfig.isEnabled) continue;
            
            jobTotal++;
            let jobWorker = this._createJob(jobConfig);
            if (jobWorker!=null) {
                let jobName = jobConfig.name.toUpperCase();
                await this._defineJob(jobName, jobWorker.getJobTime(), jobWorker);
                logger.info(`Init job done: ${jobName}`);
                jobSuccess++;
            }
        }
        logger.info(`Jobs has been initial success: jobTotal=${jobSuccess} - jobTotal=${jobTotal}`);
        return jobSuccess;
    }

    async _defineJob(jobName, jobTime, jobWorker) {
        await this.agenda.define(jobName, { concurrency: 1 }, async function(job, done) {
            try {
                await jobWorker.runJob();
            } catch(err) {
                logger.error("Run job error: " + jobName);
                logger.error(err);
            }
            done();
        });
        await this.agenda.every(jobTime, jobName);
    }

    _createJob(jobConfig) {
        try {
            let jobClass = jobConfig.class;
            let jobWorker = new classConstructors[jobClass](jobConfig);
            return jobWorker;
        } catch (err) {
            logger.error("Unable to create job" , JSON.stringify(jobConfig));
            logger.error(err);
        }
        return null;
    }

	_initAgendaUI() {
        if (!config.showAgendaUI) return;
    
        let express = require('express');
        let app = express();
        app.use('/dash', Agendash(agenda));
        // app.use('/agendash', Agendash(agenda, {
        //     middleware: 'koa'
        // }));
        app.listen(config.port, function() {
            logger.info("Agenda Dash listening at port " + config.port + "...");
        });
    }
}

module.exports = SCHEDULE_HELPER;