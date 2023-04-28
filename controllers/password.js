const Sib = require('sib-api-v3-sdk');
exports.postForgotPassword = async (req, res, next) => {
    try {
        const emailId = req.body.emailId;
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SIB_KEY_SECRET;
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            name: 'Anurag',
            email: 'anuragkushwaha723@gmail.com'
        };
        const receivers = [
            { email: emailId }
        ];
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password in Expense Tracker App',
            textContent: 'Reset your password'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
}