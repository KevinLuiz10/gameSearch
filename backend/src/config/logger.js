const winston = require('winston');
const path = require('path');

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

//LOGS DE HISTÓRICOS DE BUSCA
const searchLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/search_history.log')
        })
    ]
});

//LOGS DE HISTÓRICO DE POST
const postLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/post_history.log')
        })
    ]
});

// Logger Geral (Segurança e Erros do sistema)
const generalLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/security.log'),
            level: 'warn'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/app.log')
        })
    ]
});

module.exports = {
    logger: generalLogger,
    searchLogger,
    postLogger
};