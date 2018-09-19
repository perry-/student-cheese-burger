const responses = [
    "rotate-left",
    "rotate-right",
    "advance", 
    "retreat",
    "shoot",
    "pass"
]


function action(body) {
    return { command: responses[Math.floor((Math.random() * 5))] };
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let response = action(req.body);
    context.res = {body: response};

    context.done();
};