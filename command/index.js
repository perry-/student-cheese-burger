const ROTATE_LEFT = "rotate-left";
const ROTATE_RIGHT = "rotate-right";
const ADVANCE = "rotate-left";
const RETREAT = "retreat";
const SHOOT = "shoot";
const PASS = "pass";
const MOVE_LEFT = {"top" : ROTATE_LEFT, "bottom" : ROTATE_RIGHT, "right" : ROTATE_RIGHT,"left" : ADVANCE };
const MOVE_RIGHT = {"top" : ROTATE_RIGHT, "bottom" : ROTATE_LEFT, "right" : ADVANCE ,"left" : ROTATE_LEFT };
const MOVE_UP =  {"top" : ADVANCE, "bottom" : ROTATE_LEFT, "right" : ROTATE_LEFT ,"left" : ROTATE_RIGHT };
const MOVE_DOWN =  {"top" : ROTATE_LEFT, "bottom" : ADVANCE, "right" : ROTATE_RIGHT ,"left" : ROTATE_LEFT };

function moveTowardsPoint(body, targetPointX, targetPointY) {
    let penguinPositionX = body.you.x;
    let penguinPositionY = body.you.y;
    let plannedMovement = PASS;
    
    if (penguinPositionX < targetPointX) {
        plannedMovement =  MOVE_DOWN[body.you.direction];
    } else if (penguinPositionX > targetPointX) {
        plannedMovement = MOVE_UP[body.you.direction];
    } else if (penguinPositionY < targetPointY) {
        plannedMovement = MOVE_RIGHT[body.you.direction];
    } else if (penguinPositionY > targetPointY) {
        plannedMovement = MOVE_LEFT[body.you.direction];
    }
    if ((plannedMovement === ADVANCE && existsWallInFrontOfPenguin(body)) || penguinPositionX === targetPointX && penguinPositionY == targetPointY ) {
        return SHOOT;
    }
    return plannedMovement
}

function existsWallInFrontOfPenguin(body) {
    let xValueToCheckForWall = body.you.x;
    let yValueToCheckForWall = body.you.y;
    if (body.you.direction === "top") {
        yValueToCheckForWall--;
    } else if (body.you.direction === "bottom") {
        yValueToCheckForWall++;
    } else if (body.you.direction === "left") {
        xValueToCheckForWall--;
    } else {
        xValueToCheckForWall++;
    }
    if (body.walls.find(wall => wall.x === xValueToCheckForWall && wall.y === yValueToCheckForWall)) {
        return true;
    } else {
        return false;
    }
}

function action(body) {
    let centerPointX = Math.floor(body.mapWidth/2);
    let centerPointY = Math.floor(body.mapHeight/2);
    let response = moveTowardsPoint(body, centerPointX, centerPointY);
    return { command: response};
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let response = action(req.body);
    context.res = {body: response};

    context.done();
};