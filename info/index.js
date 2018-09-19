module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let penguinName = "Pingu";
    let teamName = "Bouvet";

    context.res = {body: {name: penguinName, team: teamName}};
    context.done();
};