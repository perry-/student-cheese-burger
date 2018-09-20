const ROTATE_LEFT = "rotate-left";
const ROTATE_RIGHT = "rotate-right";
const ADVANCE = "advance";
const RETREAT = "retreat";
const SHOOT = "shoot";
const PASS = "pass";

const MOVE_UP =  {"top" : ADVANCE, "bottom" : ROTATE_LEFT, "right" : ROTATE_LEFT ,"left" : ROTATE_RIGHT };
const MOVE_DOWN =  {"top" : ROTATE_LEFT, "bottom" : ADVANCE, "right" : ROTATE_RIGHT ,"left" : ROTATE_LEFT };
const MOVE_RIGHT = {"top" : ROTATE_RIGHT, "bottom" : ROTATE_LEFT, "right" : ADVANCE ,"left" : ROTATE_LEFT };
const MOVE_LEFT = {"top" : ROTATE_LEFT, "bottom" : ROTATE_RIGHT, "right" : ROTATE_RIGHT,"left" : ADVANCE };

const ATTACK_UP =  {"top" : SHOOT, "bottom" : ROTATE_LEFT, "right" : ROTATE_LEFT ,"left" : ROTATE_RIGHT };
const ATTACK_DOWN =  {"top" : ROTATE_LEFT, "bottom" : SHOOT, "right" : ROTATE_RIGHT ,"left" : ROTATE_LEFT };
const ATTACK_RIGHT = {"top" : ROTATE_RIGHT, "bottom" : ROTATE_LEFT, "right" : SHOOT ,"left" : ROTATE_LEFT };
const ATTACK_LEFT = {"top" : ROTATE_LEFT, "bottom" : ROTATE_RIGHT, "right" : ROTATE_RIGHT,"left" : SHOOT };

function moveTowardsCenterOfMap(body) {
    let centerPointX = Math.floor((body.mapWidth - 1)/2);
    let centerPointY = Math.floor((body.mapHeight-1)/2);
    let penguinPositionX = body.you.x;
    let penguinPositionY = body.you.y;
    let plannedMovement = PASS;
    
    if (penguinPositionX < centerPointX) {
        plannedMovement =  MOVE_RIGHT[body.you.direction];
    } else if (penguinPositionX > centerPointX) {
        plannedMovement = MOVE_LEFT[body.you.direction];
    } else if (penguinPositionY < centerPointY) {
        plannedMovement = MOVE_DOWN[body.you.direction];
    } else if (penguinPositionY > centerPointY) {
        plannedMovement = MOVE_UP[body.you.direction];
    }
    if ((plannedMovement === ADVANCE && existsWallInFrontOfPenguin(body)) || penguinPositionX === centerPointX && penguinPositionY === centerPointY ) {
        return SHOOT;
    }
    return plannedMovement
}

function existsWallInFrontOfPenguin(body) {
    let xValueToCheckForWall = body.you.x;
    let yValueToCheckForWall = body.you.y;
    switch(body.you.direction) {
        case "top":
            yValueToCheckForWall--;
            break;
        case "bottom":
            yValueToCheckForWall++;
            break;
        case "left":
            xValueToCheckForWall--;
            break;
        case "right":
            xValueToCheckForWall++;
            break;
        default:
            break;
    }
    if (body.walls.find(wall => wall.x === xValueToCheckForWall && wall.y === yValueToCheckForWall)) {
        return true;
    } else {
        return false;
    }
}

function enemyIsVisible(body) {
    if (body.enemies[0].direction) {
        return true;
    }
    return false;
}

function enemyIsOnSameLine(body) {
    return (body.enemies[0].x === body.you.x || body.enemies[0].y === body.you.y);
}

function enemyIsInRange(body) {
    return (Math.abs(body.enemies[0].x - body.you.x) <= body.you.weaponRange || Math.abs(body.enemies[0].y - body.you.y) <= body.you.weaponRange)
}

function attackEnemy(body) {
    let penguinX = body.you.x;
    let penguinY = body.you.y;
    let enemyX = body.enemies[0].x;
    let enemyY = body.enemies[0].y;

    let plannedMovement = PASS;

    if (penguinX < enemyX) {
        plannedMovement =  ATTACK_RIGHT[body.you.direction];
    } else if (penguinX > enemyX) {
        plannedMovement = ATTACK_LEFT[body.you.direction];
    } else if (penguinY < enemyY) {
        plannedMovement = ATTACK_DOWN[body.you.direction];
    } else if (penguinY > enemyY) {
        plannedMovement = ATTACK_UP[body.you.direction];
    }
    return plannedMovement;
}

function action(req, context) {
    if (req.params.query == "command") {
        let response = PASS;
        if (enemyIsVisible(req.body) && enemyIsOnSameLine(req.body) && enemyIsInRange(req.body)) {
            response = attackEnemy(req.body);
        } else {
            response = moveTowardsCenterOfMap(req.body);
        }
        return { command: response};
    }
    return info();
}

function info() {
    let penguinName = "Pingu";
    let teamName = "Bouvet";

    return {name: penguinName, team: teamName};
}
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let response = action(req, context);    
    context.res = {body: response};

    context.done();
};