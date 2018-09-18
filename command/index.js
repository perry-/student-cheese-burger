module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    let responses = [
        "rotate-left",
        "rotate-right",
        "advance", 
        "retreat",
        "shoot",
        "pass"
    ]
    let response = { command: responses[Math.floor((Math.random() * 5))] };
    context.res = {body: response};

    context.done();
};