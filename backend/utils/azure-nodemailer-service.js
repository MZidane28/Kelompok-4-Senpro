const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");
require("dotenv").config();

const connectionString = process.env['AZURE_EMAIL_CONNECTION_STRING'];
const client = new EmailClient(connectionString);

async function send_mail(payload, recipient, subject) {
    const POLLER_WAIT_TIME = 10
    try {
        const message = {
            senderAddress: "donotreply@empati.biz.id",
            content: {
                subject: subject,
                plainText: "This email message is sent from Azure Communication Services Email using the JavaScript SDK.",
                html:`
                ${payload}
                `
            },
            recipients: {
                to: [
                    {
                        address: `${recipient}`,
                    },
                ],
            },
        };

        const poller = await client.beginSend(message);

        if (!poller.getOperationState().isStarted) {
            throw "Poller was not started."
        }

        let timeElapsed = 0;
        while (!poller.isDone()) {
            poller.poll();

            await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
            timeElapsed += 10;

            if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                throw "Polling timed out.";
            }
        }

        if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
            //console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
            return true;
        }
        else {
            throw poller.getResult().error;
        }

    } catch (e) {
        console.log(e);
        throw e
    }
}

module.exports = {
    send_mail
}