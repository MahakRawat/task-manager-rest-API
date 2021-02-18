
const sgmail=require('@sendgrid/mail')
sgmail.setApiKey(process.env.Sendgrid_API_Key)

const SendingSignupEmail= (email,name)=>{
    sgmail.send({
        to:email,
        from:'mahakrawat19@gmail.com',
        subject:'welcome mail!',
        text:`hello, ${name}. We are glad to have you here. Please share your experience with us.`
    })
}
const SendingCancellationEmail= (email,name)=>{
     sgmail.send({
         to:email,
         from:'mahakrawat19@gmail.com',
         subject:'sorry for your cancellation',
         text:`hello ${name}. We are sorry for your cancellation.`
     })
}
module.exports={
    SendingSignupEmail,
    SendingCancellationEmail
}