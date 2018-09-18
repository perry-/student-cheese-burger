module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.res = {body: {name: "Pingu", team: "Bouvet"}};
    context.done();
};