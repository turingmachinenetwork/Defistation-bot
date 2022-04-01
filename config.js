require('dotenv').config();

module.exports = {
    environment: process.env.NODE_ENV,
    showAgendaUI: true,
    port: process.env.PORT || 80,
    mongoConnectionString: process.env.DB_PATH,
    logLevel: process.env.LOG_LEVEL,
    bscNode: process.env.BSC_NODE,
    bscscanApiKey: process.env.BSCSCAN_API_KEY,
    bscNetworkName: process.env.BSC_NETWORK_NAME,
    defaultLog4jConfig: {
        appenders: {
            console: { type: "console" },
            app: { type: "file", filename: "logs/defistation.log" }
        },
        categories: {
            default: { appenders: ["console", "app"], level: process.env.LOG_LEVEL }
        }
    },
    tronEnv: {

    },
    totalVaults: parseInt(process.env.TOTAL_VAULTS) || 3,
    syncPoolHistoryPeriodTime: parseInt(process.env.SYNC_POOL_HISTORY_PERIOD_TIME) || 24 * 60 * 60 * 1000,
    jobs: [
        {
            name: "update-tvl-to-defistation",
            isEnabled: true,
            class: "UpdateTVLToDefistation",
            defistationURl: process.env.DEFISTATION_URL,
            defistationUsername: process.env.DEFISTATION_USERNAME,
            defistationKey: process.env.DEFISTATION_KEY,
            jobTime: "1 hours"
        }
    ]
};
