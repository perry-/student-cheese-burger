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
    let centerPointY = Math.floor((body.mapHeight - 1)/2);
    return moveTowardsPoint(body, centerPointX, centerPointY);
}

function moveTowardsPoint(body, pointX, pointY) {
    let penguinPositionX = body.you.x;
    let penguinPositionY = body.you.y;
    let plannedAction = PASS;
    
    if (penguinPositionX < pointX) {
        plannedAction =  MOVE_RIGHT[body.you.direction];
    } else if (penguinPositionX > pointX) {
        plannedAction = MOVE_LEFT[body.you.direction];
    } else if (penguinPositionY < pointY) {
        plannedAction = MOVE_DOWN[body.you.direction];
    } else if (penguinPositionY > pointY) {
        plannedAction = MOVE_UP[body.you.direction];
    }
    if (plannedAction === ADVANCE && wallInFrontOfPenguin(body)) {
        return SHOOT;
    }
    return plannedAction
}

function doesCellContainWall(walls, x, y) {
    if (walls.find(wall => wall.x === x && wall.y === y)) {
        return true;
    }
    return false;
}

function wallInFrontOfPenguin(body) {
    switch(body.you.direction) {
        case "top":
            return doesCellContainWall(body.walls, body.you.x, body.you.y--);
        case "bottom":
            return doesCellContainWall(body.walls, body.you.x, body.you.y++);
        case "left":
            return doesCellContainWall(body.walls, body.you.x--, body.you.y);
        case "right":
            return doesCellContainWall(body.walls, body.you.x++, body.you.y);
        default:
            return true;
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
    // return (Math.abs(body.enemies[0].x - body.you.x) < body.you.weaponRange - 1 
    // || Math.abs(body.enemies[0].y - body.you.y) < body.you.weaponRange - 1);
    return body.you.targetRange <= body.you.weaponRange;
}

function attackEnemy(body) {
    let penguinX = body.you.x;
    let penguinY = body.you.y;
    let enemyX = body.enemies[0].x;
    let enemyY = body.enemies[0].y;
    let plannedAction = PASS;

    if (penguinX < enemyX) {
        plannedAction =  ATTACK_RIGHT[body.you.direction];
    } else if (penguinX > enemyX) {
        plannedAction = ATTACK_LEFT[body.you.direction];
    } else if (penguinY < enemyY) {
        plannedAction = ATTACK_DOWN[body.you.direction];
    } else if (penguinY > enemyY) {
        plannedAction = ATTACK_UP[body.you.direction];
    }
    return plannedAction;
}

function commandReceived(body) {
    let response = PASS;
    if (enemyIsVisible(body) && enemyIsOnSameLine(body) && enemyIsInRange(body)) {
        response = attackEnemy(body);
    } else {
        response = moveTowardsCenterOfMap(body);
    }
    return { command: response};
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let response = action(req);    
    context.res = {body: response};

    context.done();
};

function action(req) {
    if (req.params.query == "command") {
        return commandReceived(req.body);
    }
    return infoReceived();
}

function infoReceived() {
    let penguinName = "Pingu";
    let teamName = "Bouvet";

    return {name: penguinName, team: teamName};
}