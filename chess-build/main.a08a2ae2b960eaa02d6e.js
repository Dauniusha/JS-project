(()=>{"use strict";var e,t={57:(e,t,o)=>{o.r(t)},995:(e,t,o)=>{o.r(t)},978:(e,t,o)=>{o.r(t)},115:(e,t,o)=>{o.r(t)},906:(e,t,o)=>{o.r(t)},77:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.App=void 0;var n=o(0),i=o(229),s=o(977),r=o(381),a=o(649),l=function(){function e(e){this.rootElement=e,this.header=new s.Header,this.rootElement.appendChild(this.header.element),this.footer=new n.Footer,this.rootElement.appendChild(this.footer.element),this.router=new a.Router,this.initRoute()}return e.prototype.initRoute=function(){var e=this;this.router.add({pageName:"lobby",hash:"#/Lobby",needFoo:function(){return e.startLobbyPage()}}),this.router.add({pageName:"setting",hash:"#/Setting",needFoo:function(){return e.startSettingPage()}}),this.router.add({pageName:"game",hash:"#/Game",needFoo:function(){return e.startGamePage()}}),this.router.add({pageName:"replays",hash:"#/Replays",needFoo:function(){return e.startReplaysPage()}})},e.prototype.startLobbyPage=function(){this.clearWindow(),this.lobby||(this.lobby=new r.Lobby),this.activePage=this.lobby,this.rootElement.insertBefore(this.lobby.element,this.footer.element)},e.prototype.startSettingPage=function(){},e.prototype.startGamePage=function(){this.clearWindow(),this.game||(this.game=new i.Game),this.activePage=this.game,this.rootElement.insertBefore(this.game.element,this.footer.element)},e.prototype.startReplaysPage=function(){},e.prototype.clearWindow=function(){var e;null===(e=this.activePage)||void 0===e||e.element.remove()},e}();t.App=l},636:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.ChessBoard=void 0;var s=o(650),r=o(836),a=o(175),l=o(443),c=o(767),p=o(278),h=o(506),u=o(188),d=o(595);o(57);var f=function(e){function t(){var t=e.call(this,"div",[d.setting.classNames.board])||this;return t.pieces=[],t.allMoves=[],t.cells=t.cellsInit(),t.element.appendChild(t.boardNumerationInit("number")),t.element.appendChild(t.boardNumerationInit("letter")),t.newPlacePieces(),t.allPossibleMoveDetermination(),t}return i(t,e),t.prototype.cellsInit=function(){for(var e=[],t=!0,o=8;o>=1;o--){for(var n=1;n<=8;n++){var i=document.createElement("div");i.id=""+String.fromCharCode(96+n)+o,t?i.classList.add(d.setting.classNames.cell,d.setting.classNames.whiteCell):i.classList.add(d.setting.classNames.cell,d.setting.classNames.blackCell),t=!t,e.push(i),this.element.appendChild(i)}t=!t}return e},t.prototype.boardNumerationInit=function(e){var t=document.createElement("div");if(t.classList.add(d.setting.classNames.numerationAll),e===d.setting.classNames.numberId){t.id=d.setting.classNames.numberId;for(var o=8;o>=1;o--){var n=document.createElement("div");n.innerHTML=String(o),n.classList.add(d.setting.classNames.numerationEach),t.appendChild(n)}}else for(t.id=d.setting.classNames.letterId,o=1;o<=8;o++){var i=document.createElement("div");i.innerHTML=String.fromCharCode(96+o),i.classList.add(d.setting.classNames.numerationEach),t.appendChild(i)}return t},t.prototype.newPlacePieces=function(){var e=this;d.setting.gameSetup.forEach((function(t){var o=t.piece,n=d.setting.createFunctions[o](t.cell);e.pieces.push(n);var i=r.cellNameToCellPosition(t.cell);e.cells[i].appendChild(n.element)}))},t.prototype.allPossibleMoveDetermination=function(){var e=this;this.pieces.forEach((function(t){t.possibleMoveDetermination(d.setting.gameSetup),e.capturingEnPassantValidation(t)})),this.castlingDetermination(),this.updateAllPossibleMoves()},t.prototype.updateAllPossibleMoves=function(){var e=this;this.allMoves=[],this.pieces.forEach((function(t){e.allMoves.push({cell:t.cell,moves:t.possibleMoves})}))},t.prototype.capturingEnPassantValidation=function(e){if(e instanceof c.Pawn){var t=a.cellNameToCoordinates(e.cell),o=e.getPawnIncrement()>0?d.setting.passantCell.positiveIncrement:d.setting.passantCell.negativeIncrement,n={X:t.X,Y:o};JSON.stringify(t)===JSON.stringify(n)&&(this.passantInDirection(e,1),this.passantInDirection(e,-1))}},t.prototype.passantInDirection=function(e,t){var o=a.cellNameToCoordinates(e.cell),n={X:o.X+t,Y:o.Y+e.getPawnIncrement()},i=s.cellCoordinatesToName(n),r={X:o.X+t,Y:o.Y},l=s.cellCoordinatesToName(r);this.passantPiecesValidation(l)&&e.possibleMoves.push(i)},t.prototype.passantPiecesValidation=function(e){for(var t=0;t<this.pieces.length;t++){var o=this.pieces[t];if(o.cell===e&&o instanceof c.Pawn&&o.canBeCapturedEnPassant)return!0}return!1},t.prototype.castlingDetermination=function(){this.castlingForEachPiece(u.color.white),this.castlingForEachPiece(u.color.black)},t.prototype.castlingForEachPiece=function(e){var t=this.kingSearcher(e),o=a.cellNameToCoordinates(t.cell);this.castlingValidationInDirection(t,1)&&t.possibleMoves.push(s.cellCoordinatesToName({X:o.X+2,Y:o.Y})),this.castlingValidationInDirection(t,-1)&&t.possibleMoves.push(s.cellCoordinatesToName({X:o.X-2,Y:o.Y}))},t.prototype.kingSearcher=function(e){for(var t=0;t<this.pieces.length;t++){var o=this.pieces[t];if(o instanceof l.King&&o.color===e)return o}throw Error("King does not exist!")},t.prototype.castlingValidationInDirection=function(e,o){if(e.isFirstMove){var n=a.cellNameToCoordinates(e.cell),i=t.getReverseColor(e.color);return!this.clearCellAndRookValidation(n,o)&&!this.castlingCellInCheckValidation(i,n,o)}return!1},t.prototype.clearCellAndRookValidation=function(e,t){for(var o,n=e.X+t;n<8&&n>-1;n+=t){if(7===n||0===n){for(var i=0;i<this.pieces.length;i++)if(this.pieces[i].cell===s.cellCoordinatesToName({X:n,Y:e.Y})&&this.pieces[i]instanceof p.Rook){o=this.pieces[i];break}return!(null==o?void 0:o.isFirstMove)}var r=s.cellCoordinatesToName({X:n,Y:e.Y});for(i=0;i<d.setting.gameSetup.length;i++)if(d.setting.gameSetup[i].cell===r)return!0}throw Error("Breaking bad!")},t.prototype.castlingCellInCheckValidation=function(e,t,o){for(var n=this.possibleWhitesOrBlacksMoves(e),i=Math.abs(2*o),r=t.X;r>t.X-i&&r<t.X+i;r+=o){var a=s.cellCoordinatesToName({X:r,Y:t.Y});if(-1!==n.indexOf(a))return!0}return!1},t.prototype.getAllCells=function(){return this.cells},t.prototype.selectPiece=function(e){for(var t=0;t<this.pieces.length;t++)if(this.pieces[t].cell===e)return this.pieces[t];throw Error()},t.prototype.pieceMove=function(e,o){(o instanceof p.Rook||o instanceof l.King)&&(this.castlingMove(e,o),o.isFirstMove=!1),this.capturingEnPassantTry(e,o),this.longPawnMoveReset(),t.longPawnMoveValidation(e,o),this.capturingTry(e),o.element.remove(),this.cells[r.cellNameToCellPosition(e)].appendChild(o.element),t.updateGameSetup(e,o),o.cell=e,this.allPossibleMoveDetermination(),this.removeMovesForСheck(u.color.white),this.removeMovesForСheck(u.color.black)},t.prototype.longPawnMoveReset=function(){for(var e=0;e<this.pieces.length;e++){var t=this.pieces[e];t instanceof c.Pawn&&(t.canBeCapturedEnPassant=!1)}},t.longPawnMoveValidation=function(e,t){var o=a.cellNameToCoordinates(e),n=a.cellNameToCoordinates(t.cell);t instanceof c.Pawn&&(t.canBeCapturedEnPassant=2===Math.abs(o.Y-n.Y))},t.prototype.capturingEnPassantTry=function(e,t){if(t instanceof c.Pawn){var o=a.cellNameToCoordinates(e),n=a.cellNameToCoordinates(t.cell),i=o.X-n.X;if(i)for(var r=s.cellCoordinatesToName({X:n.X+i,Y:n.Y}),l=0;l<this.pieces.length;l++){var p=this.pieces[l];if(p instanceof c.Pawn&&p.cell===r&&p.canBeCapturedEnPassant){for(var h=0;h<d.setting.gameSetup.length;h++)if(d.setting.gameSetup[h].cell===r){d.setting.gameSetup.splice(h,1);break}p.element.remove(),this.pieces.splice(l,1);break}}}},t.updateGameSetup=function(e,t){for(var o=0;o<d.setting.gameSetup.length;o++)if(d.setting.gameSetup[o].cell===t.cell){d.setting.gameSetup[o].cell=e;break}},t.prototype.capturingTry=function(e){for(var t=0;t<this.pieces.length;t++)if(this.pieces[t].cell===e){for(var o=0;o<d.setting.gameSetup.length;o++)d.setting.gameSetup[o].cell===e&&d.setting.gameSetup.splice(o,1);this.pieces[t].element.remove(),this.pieces.splice(t,1);break}},t.prototype.castlingMove=function(e,o){var n=a.cellNameToCoordinates(e),i=a.cellNameToCoordinates(o.cell);if(o instanceof l.King&&o.isFirstMove&&(n.X===i.X+2||n.X===i.X-2)){for(var c=(n.X-i.X)/2,h=c>0?7:0,u=s.cellCoordinatesToName({X:h,Y:i.Y}),d=void 0,f=0;f<this.pieces.length;f++)if(this.pieces[f].cell===u&&this.pieces[f]instanceof p.Rook){d=this.pieces[f];break}if(!d)throw Error("Rook does not exist!");var v=s.cellCoordinatesToName({X:i.X+c,Y:i.Y});d.element.remove(),this.cells[r.cellNameToCellPosition(v)].appendChild(d.element),t.updateGameSetup(v,d),d.cell=v}},t.prototype.removeMovesForСheck=function(e){var o=JSON.parse(JSON.stringify(d.setting.gameSetup)),n=t.getReverseColor(e);this.possibleMoveDeterminationInCheck(n,o)},t.prototype.possibleMoveDeterminationInCheck=function(e,o){var n=this,i=[],s=[];this.pieces.forEach((function(t){t.color===e?i.push(t):s.push(t)})),i.forEach((function(e){for(var i=e.cell,r=0;r<e.possibleMoves.length;r++){var a=n.testCapturing(o,e,s,e.possibleMoves[r]);t.moveTesting(o,e,e.possibleMoves[r]),n.testCheckValidation(o,s)&&(e.possibleMoves.splice(r,1),r--),a&&(o.push(a.capturedPieceSetup),s.push(a.capturedPiece))}t.moveTesting(o,e,i)})),this.updateAllPossibleMoves()},t.prototype.testCheckValidation=function(e,o){if(!o.length)return!1;var n=o[0].color===u.color.white?u.color.black:u.color.white,i=t.getKingPosition(e,n),s=[];return o.forEach((function(t){var o=Object.assign(Object.create(Object.getPrototypeOf(t)),t);o.possibleMoveDetermination(e),s.push.apply(s,o.possibleMoves)})),-1!==s.indexOf(i)},t.moveTesting=function(e,t,o){for(var n=0;n<e.length;n++)if(e[n].cell===t.cell&&-1!==e[n].piece.indexOf(t.color)){e[n].cell=o;break}t.cell=o},t.prototype.testCapturing=function(e,t,o,n){for(var i,s,r=0;r<e.length;r++)if(e[r].cell===n&&-1===e[r].piece.indexOf(t.color)){i=e[r],e.splice(r,1);break}for(r=0;r<o.length;r++)if(o[r].cell===n){s=o[r],o.splice(r,1);break}if(this.testCapturingEnPassant(i,s,n,e,t,o),s&&i)return{capturedPieceSetup:i,capturedPiece:s}},t.prototype.testCapturingEnPassant=function(e,t,o,n,i,r){if(i instanceof c.Pawn)for(var l=a.cellNameToCoordinates(o),p=s.cellCoordinatesToName({X:l.X,Y:l.Y-i.getPawnIncrement()}),h=0;h<r.length;h++){var u=r[h];if(u instanceof c.Pawn&&u.cell===p&&u.canBeCapturedEnPassant){for(var d=0;d<n.length;d++)if(n[d].cell===p){n[d],n.splice(d,1);break}r.splice(h,1);break}}},t.prototype.checkValidation=function(e){var o=t.getReverseColor(e),n=t.getKingPosition(d.setting.gameSetup,o);return-1!==this.possibleWhitesOrBlacksMoves(e).indexOf(n)},t.prototype.movePossibilityValidation=function(e){var o=t.getReverseColor(e);return!!this.possibleWhitesOrBlacksMoves(o).length},t.prototype.possibleWhitesOrBlacksMoves=function(e){var t=[];return this.pieces.forEach((function(o){o.color===e&&t.push.apply(t,o.possibleMoves)})),t},t.prototype.getCheckPieces=function(e){var o=[],n=t.getReverseColor(e),i=t.getKingPosition(d.setting.gameSetup,n);return this.pieces.forEach((function(e){-1===e.possibleMoves.indexOf(i)&&e.cell!==i||o.push(e)})),o},t.getKingPosition=function(e,t){for(var o=0;o<e.length;o++)if(e[o].piece===t+"King")return e[o].cell;throw Error("King does not exist")},t.getReverseColor=function(e){return e===u.color.white?u.color.black:u.color.white},t}(h.BaseComponents);t.ChessBoard=f},839:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.BasePiece=void 0;var s=o(650),r=o(506),a=o(188),l=o(595),c=function(e){function t(t,o){var n=e.call(this,"img",[l.setting.classNames.piece])||this;return n.possibleMoves=[],n.cell=t,n.color=o,n}return i(t,e),t.piecesCheck=function(e,t){var o=s.cellCoordinatesToName({X:e.X,Y:e.Y}),n="";if(t.forEach((function(e){e.cell!==o||(n=e.piece)})),n)return-1!==n.indexOf(a.color.black)?a.color.black:a.color.white},t.prototype.possibleMoveCheck=function(e,o,n,i){for(var r=e.X+o,a=e.Y+n;r<8&&r>-1&&a<8&&a>-1;r+=o,a+=n){var l={X:r,Y:a},c=t.piecesCheck(l,i);if(c){c!==this.color&&this.possibleMoves.push(s.cellCoordinatesToName(l));break}this.possibleMoves.push(s.cellCoordinatesToName(l))}},t}(r.BaseComponents);t.BasePiece=c},91:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Bishop=void 0;var s=o(175),r=o(595),a=function(e){function t(t,o){var n=e.call(this,t,o)||this,i=o+"Bishop";return n.element.setAttribute(r.setting.classNames.dataPiece,i),n.element.src=r.setting.imgNames[i],n}return i(t,e),t.prototype.possibleMoveDetermination=function(e){this.possibleMoves=[];var t=s.cellNameToCoordinates(this.cell);this.possibleMoveCheck(t,-1,1,e),this.possibleMoveCheck(t,1,1,e),this.possibleMoveCheck(t,1,-1,e),this.possibleMoveCheck(t,-1,-1,e)},t}(o(839).BasePiece);t.Bishop=a},443:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.King=void 0;var s=o(650),r=o(175),a=o(595),l=o(839),c=function(e){function t(t,o){var n=e.call(this,t,o)||this;n.isFirstMove=!0;var i=o+"King";return n.element.setAttribute(a.setting.classNames.dataPiece,i),n.element.src=a.setting.imgNames[i],n}return i(t,e),t.prototype.possibleMoveDetermination=function(e){this.possibleMoves=[];for(var t=r.cellNameToCoordinates(this.cell),o=t.Y-1;o<t.Y+2;o++)if(o<8&&o>-1)for(var n=t.X-1;n<t.X+2;n++)n<8&&n>-1&&l.BasePiece.piecesCheck({X:n,Y:o},e)!==this.color&&this.possibleMoves.push(s.cellCoordinatesToName({X:n,Y:o}))},t}(l.BasePiece);t.King=c},822:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Knight=void 0;var s=o(650),r=o(175),a=o(595),l=o(839),c=function(e){function t(t,o){var n=e.call(this,t,o)||this,i=o+"Knight";return n.element.setAttribute(a.setting.classNames.dataPiece,i),n.element.src=a.setting.imgNames[i],n}return i(t,e),t.prototype.possibleMoveDetermination=function(e){this.possibleMoves=[];var t=r.cellNameToCoordinates(this.cell);this.possibleMoveCheck(t,1,2,e),this.possibleMoveCheck(t,-1,2,e),this.possibleMoveCheck(t,1,-2,e),this.possibleMoveCheck(t,-1,-2,e),this.possibleMoveCheck(t,2,1,e),this.possibleMoveCheck(t,2,-1,e),this.possibleMoveCheck(t,-2,1,e),this.possibleMoveCheck(t,-2,-1,e)},t.prototype.possibleMoveCheck=function(e,t,o,n){var i=e.X+t,r=e.Y+o;i<8&&i>-1&&r<8&&r>-1&&l.BasePiece.piecesCheck({X:i,Y:r},n)!==this.color&&this.possibleMoves.push(s.cellCoordinatesToName({X:i,Y:r}))},t}(l.BasePiece);t.Knight=c},767:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Pawn=void 0;var s=o(650),r=o(175),a=o(188),l=o(595),c=o(839),p=function(e){function t(t,o){var n,i,s=e.call(this,t,o)||this;s.canBeCapturedEnPassant=!1;var r=o+"Pawn";return s.element.setAttribute(l.setting.classNames.dataPiece,r),s.element.src=l.setting.imgNames[r],l.setting.isWhiteFromBelow?(n=s.color===a.color.white?[1,"2"]:[-1,"7"],s.pawnIncrement=n[0],s.startRow=n[1]):(i=s.color===a.color.white?[-1,"7"]:[1,"2"],s.pawnIncrement=i[0],s.startRow=i[1]),s}return i(t,e),t.prototype.possibleMoveDetermination=function(e){this.possibleMoves=[];var t=r.cellNameToCoordinates(this.cell);this.possiblePawnMoveCheck(t,e)&&this.cell[1]===this.startRow&&this.possiblePawnMoveCheck({X:t.X,Y:t.Y+this.pawnIncrement},e),this.possibleCaptureCheck(t,-1,e),this.possibleCaptureCheck(t,1,e)},t.prototype.possiblePawnMoveCheck=function(e,t){var o=e.Y+this.pawnIncrement;return o<8&&o>-1&&!c.BasePiece.piecesCheck({X:e.X,Y:o},t)&&(this.possibleMoves.push(s.cellCoordinatesToName({X:e.X,Y:o})),!0)},t.prototype.possibleCaptureCheck=function(e,t,o){var n=e.X+t,i=e.Y+this.pawnIncrement;n<8&&n>-1&&i<8&&i>-1&&c.BasePiece.piecesCheck({X:n,Y:i},o)&&c.BasePiece.piecesCheck({X:n,Y:i},o)!==this.color&&this.possibleMoves.push(s.cellCoordinatesToName({X:n,Y:i}))},t.prototype.getPawnIncrement=function(){return this.pawnIncrement},t}(c.BasePiece);t.Pawn=p},336:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Queen=void 0;var s=o(175),r=o(595),a=function(e){function t(t,o){var n=e.call(this,t,o)||this,i=o+"Queen";return n.element.setAttribute(r.setting.classNames.dataPiece,i),n.element.src=r.setting.imgNames[i],n}return i(t,e),t.prototype.possibleMoveDetermination=function(e){this.possibleMoves=[];var t=s.cellNameToCoordinates(this.cell);this.possibleMoveCheck(t,-1,1,e),this.possibleMoveCheck(t,0,1,e),this.possibleMoveCheck(t,1,1,e),this.possibleMoveCheck(t,1,0,e),this.possibleMoveCheck(t,1,-1,e),this.possibleMoveCheck(t,0,-1,e),this.possibleMoveCheck(t,-1,-1,e),this.possibleMoveCheck(t,-1,0,e)},t}(o(839).BasePiece);t.Queen=a},278:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Rook=void 0;var s=o(175),r=o(595),a=function(e){function t(t,o){var n=e.call(this,t,o)||this;n.isFirstMove=!0;var i=o+"Rook";return n.element.setAttribute(r.setting.classNames.dataPiece,i),n.element.src=r.setting.imgNames[i],n}return i(t,e),t.prototype.possibleMoveDetermination=function(e){this.possibleMoves=[];var t=s.cellNameToCoordinates(this.cell);this.possibleMoveCheck(t,0,1,e),this.possibleMoveCheck(t,0,-1,e),this.possibleMoveCheck(t,1,0,e),this.possibleMoveCheck(t,-1,0,e)},t.prototype.getPossibleMoves=function(){return this.possibleMoves},t}(o(839).BasePiece);t.Rook=a},0:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Footer=void 0;var s=o(506);o(995);var r=function(e){function t(){var t=e.call(this,"footer",["footer"])||this;return t.element.innerHTML='\n    <div class="footer__container">\n      <a class="footer__link" href="https://github.com/Dauniusha">GitHub</a>\n      <span class="footer__text">RS School 2021</span>\n    </div>\n    ',t}return i(t,e),t}(s.BaseComponents);t.Footer=r},229:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;var s=o(636),r=o(506),a=o(188),l=o(595);o(978);var c=function(e){function t(){var t=e.call(this,"section",["game"])||this;return t.possibleCells=[],t.isWhiteMove=!0,t.chessBoard=new s.ChessBoard,t.element.appendChild(t.chessBoard.element),t.chessBoardListnersInit(),t}return i(t,e),t.prototype.getChessBoard=function(){return this.chessBoard},t.prototype.chessBoardListnersInit=function(){var e=this;this.chessBoard.element.addEventListener("click",(function(t){var o,n,i,s,r,c,p=null===(o=t.target)||void 0===o?void 0:o.closest("."+l.setting.classNames.piece);if(e.isWhiteMove?a.color.white:a.color.black,(null===(n=t.target)||void 0===n?void 0:n.closest("."+l.setting.classNames.possibleClearCell))||(null===(i=t.target)||void 0===i?void 0:i.closest("."+l.setting.classNames.possibleEngagedCell)))(h=null===(s=t.target)||void 0===s?void 0:s.closest("."+l.setting.classNames.cell))&&(e.pieceMove(h.id),e.isWhiteMove=!e.isWhiteMove);else if(p){var h;(h=null===(r=t.target)||void 0===r?void 0:r.closest("."+l.setting.classNames.cell))&&(null===(c=e.pieceActive)||void 0===c?void 0:c.cell)!==h.id?e.selectPiece(h.id):(e.possibleCellsBacklightRemove(),e.pieceActive=void 0)}else e.possibleCellsBacklightRemove()}))},t.prototype.selectPiece=function(e){this.possibleCellsBacklightRemove(),this.pieceActive=this.chessBoard.selectPiece(e),this.possibleCellsBacklightAdd()},t.prototype.possibleCellsBacklightAdd=function(){var e,t,o,n=this,i=this.chessBoard.getAllCells();null===(t=null===(e=this.pieceActive)||void 0===e?void 0:e.element.parentElement)||void 0===t||t.classList.add(l.setting.classNames.selectPieceBacklight),null===(o=this.pieceActive)||void 0===o||o.possibleMoves.forEach((function(e){i.forEach((function(t){e===t.id&&(t.childElementCount?t.classList.add(l.setting.classNames.possibleEngagedCell):t.classList.add(l.setting.classNames.possibleClearCell),n.possibleCells.push(t))}))}))},t.prototype.possibleCellsBacklightRemove=function(){var e,t;null===(t=null===(e=this.pieceActive)||void 0===e?void 0:e.element.parentElement)||void 0===t||t.classList.remove(l.setting.classNames.selectPieceBacklight),this.possibleCells.forEach((function(e){e.classList.remove(l.setting.classNames.possibleClearCell),e.classList.remove(l.setting.classNames.possibleEngagedCell)})),this.possibleCells=[]},t.prototype.pieceMove=function(e){this.pieceActive&&(this.checkBacklightRemove(),this.moveBacklightRemove(),this.possibleCellsBacklightRemove(),this.moveBacklightAdd(e),this.chessBoard.pieceMove(e,this.pieceActive),this.checkMateValidation(this.pieceActive.color),this.pieceActive=void 0)},t.prototype.moveBacklightAdd=function(e){var t=this;this.chessBoard.getAllCells().forEach((function(o){var n;(null===(n=t.pieceActive)||void 0===n?void 0:n.cell)!==o.id&&e!==o.id||o.classList.add(l.setting.classNames.moveBacklight)}))},t.prototype.moveBacklightRemove=function(){this.chessBoard.getAllCells().forEach((function(e){e.classList.contains(l.setting.classNames.moveBacklight)&&e.classList.remove(l.setting.classNames.moveBacklight)}))},t.prototype.checkMateValidation=function(e){var t=this.chessBoard.checkValidation(e),o=this.chessBoard.movePossibilityValidation(e);t&&!o?(this.checkBacklightAdd(),console.log("mate")):t?(this.checkBacklightAdd(),console.log("check")):o||console.log("stalemate")},t.prototype.checkBacklightAdd=function(){this.pieceActive&&(this.checkPieces=this.chessBoard.getCheckPieces(this.pieceActive.color),this.checkPieces.forEach((function(e){var t;null===(t=e.element.parentElement)||void 0===t||t.classList.add(l.setting.classNames.checkBacklight)})))},t.prototype.checkBacklightRemove=function(){this.checkPieces&&this.checkPieces.forEach((function(e){var t;null===(t=e.element.parentElement)||void 0===t||t.classList.remove(l.setting.classNames.checkBacklight)}))},t}(r.BaseComponents);t.Game=c},977:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Header=void 0;var s=o(506),r=o(595);o(115);var a=function(e){function t(){var t=e.call(this,"header",[r.setting.classNames.headers.header])||this;return t.container=document.createElement("div"),t.container.classList.add(r.setting.classNames.headers.container),t.element.appendChild(t.container),t.addLogo(),t}return i(t,e),t.prototype.addLogo=function(){var e=document.createElement("div");e.classList.add(r.setting.classNames.headers.logo),e.innerHTML='\n      <img class="'+r.setting.classNames.headers.logoImg+'" src="./logo/logo.svg">\n      <span class="'+r.setting.classNames.headers.logoText+'">Chess</span>\n    ',this.container.appendChild(e)},t}(s.BaseComponents);t.Header=a},381:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Lobby=void 0;var s=o(735),r=o(506),a=o(559),l=o(595);o(906);var c=function(e){function t(){var o,n=e.call(this,"section",[l.setting.classNames.lobby.lobby])||this;n.container=s.createElement([l.setting.classNames.lobby.container]),n.element.appendChild(n.container);var i=n.playerBlockInit();n.playerFirst=new a.Player("Player 1"),n.replaysBtn=t.replaysBtnInit(),i.appendChild(n.playerFirst.element),i.appendChild(n.replaysBtn),o=t.startBtnAndSwicherInit(),n.startGameBtn=o[0],n.gameSwitcherBtn=o[1],n.container.appendChild(n.startGameBtn);var r=n.playerBlockInit();return n.playerSecond=new a.Player("Player 2"),n.settingBtn=t.settingBtnInit(),r.appendChild(n.playerSecond.element),r.appendChild(n.settingBtn),n}return i(t,e),t.prototype.playerBlockInit=function(){var e=document.createElement("div");return e.classList.add("player-menu"),this.container.appendChild(e),e},t.replaysBtnInit=function(){var e=document.createElement("a");return e.classList.add(l.setting.classNames.lobby.menu.menu,l.setting.classNames.lobby.menu.replay),e.href="#/Replays",e.innerHTML='\n      <p class="'+l.setting.classNames.lobby.menu.replayText+'">View replays</p>\n      <img class="'+l.setting.classNames.lobby.menu.replayImg+'" src="./lobby/replays/play-button.svg" alt="play">\n    ',e},t.settingBtnInit=function(){var e=document.createElement("a");return e.href="#/Setting",e.classList.add(l.setting.classNames.lobby.menu.menu,l.setting.classNames.lobby.menu.setting),e.innerHTML='\n      <img class="'+l.setting.classNames.lobby.menu.settingImg+'" src="./lobby/setting/settings.svg" alt="setting">\n    ',e},t.startBtnAndSwicherInit=function(){var e=document.createElement("a");e.href="#/Game",e.classList.add(l.setting.classNames.lobby.menu.menu,l.setting.classNames.lobby.menu.start),e.innerHTML='\n      <h2 class="'+l.setting.classNames.lobby.menu.startText+'">Start</h2>\n    ';var t=document.createElement("div");return t.classList.add(l.setting.classNames.lobby.menu.menu,l.setting.classNames.lobby.menu.gameMode),t.dataset.mode="online",t.innerHTML='\n      <div class="game-mode__text" id="online">Online</div>\n      <div class="game-mode__text" id="offline">Offline</div>\n    ',e.appendChild(t),[e,t]},t}(r.BaseComponents);t.Lobby=c},506:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseComponents=void 0;t.BaseComponents=function(e,t){var o;void 0===e&&(e="div"),void 0===t&&(t=[]),this.element=document.createElement(e),(o=this.element.classList).add.apply(o,t)}},188:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.color=void 0,t.color={white:"white",black:"black"}},559:function(e,t,o){var n,i=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function o(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(o.prototype=t.prototype,new o)});Object.defineProperty(t,"__esModule",{value:!0}),t.Player=void 0;var s=o(506),r=o(595),a=function(e){function t(t){var o=e.call(this,"div",[r.setting.classNames.player.player])||this;return o.avatar=o.avatarInit(),o.name=o.nameInit(t),o}return i(t,e),t.prototype.nameInit=function(e){var t=document.createElement("input");return t.classList.add(r.setting.classNames.player.name),t.type="text",t.value=e,this.element.appendChild(t),t},t.prototype.avatarInit=function(){var e=document.createElement("input");return e.classList.add(r.setting.classNames.player.avatar),this.element.appendChild(e),e},t}(s.BaseComponents);t.Player=a},649:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Router=void 0;var n=o(595),i=function(){function e(){this.routes=[]}return e.prototype.add=function(e){this.routes.push(e)},e.prototype.newRoute=function(e){this.enumiration(e)},e.prototype.changeRoute=function(){var e=window.location.hash;e?this.enumiration(e):this.enumiration(n.setting.startPage)},e.prototype.enumiration=function(e){for(var t=0;t<this.routes.length;t++)if(this.routes[t].hash===e){this.routes[t].needFoo();break}},e}();t.Router=i},595:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.setting=void 0;var n=o(91),i=o(443),s=o(822),r=o(767),a=o(336),l=o(278),c=o(188);t.setting={classNames:{board:"chess-board",cell:"cell",whiteCell:"white-cell",blackCell:"black-cell",numerationAll:"cell-numeration",numerationEach:"cell-nnumeration__each",letterId:"letter",numberId:"number",piece:"piece",dataPiece:"piece-type",possibleClearCell:"possible-clear-ceil",possibleEngagedCell:"possible-engaged-ceil",moveBacklight:"move-backlight",checkBacklight:"check-backlight",selectPieceBacklight:"select-piece-backlight",headers:{header:"header",container:"header__container",logo:"header-logo",logoImg:"header-logo__img",logoText:"header-logo__text"},lobby:{lobby:"lobby",container:"lobby__container",menu:{menu:"menu",replay:"menu-replay",replayText:"menu-replay__text",replayImg:"menu-replay__img",setting:"menu-setting",settingImg:"menu-setting__inner",start:"menu-start",startText:"menu-start__text",gameMode:"game-mode"}},player:{player:"player",avatar:"player__avatar",name:"player__name"}},gameSetup:[{cell:"a8",piece:"blackRook"},{cell:"b8",piece:"blackKnight"},{cell:"c8",piece:"blackBishop"},{cell:"d8",piece:"blackQueen"},{cell:"e8",piece:"blackKing"},{cell:"f8",piece:"blackBishop"},{cell:"g8",piece:"blackKnight"},{cell:"h8",piece:"blackRook"},{cell:"a7",piece:"blackPawn"},{cell:"b7",piece:"blackPawn"},{cell:"c5",piece:"blackPawn"},{cell:"d6",piece:"blackPawn"},{cell:"e7",piece:"blackPawn"},{cell:"f7",piece:"blackPawn"},{cell:"g7",piece:"blackPawn"},{cell:"h7",piece:"blackPawn"},{cell:"a1",piece:"whiteRook"},{cell:"b1",piece:"whiteKnight"},{cell:"c1",piece:"whiteBishop"},{cell:"d1",piece:"whiteQueen"},{cell:"e1",piece:"whiteKing"},{cell:"f1",piece:"whiteBishop"},{cell:"g1",piece:"whiteKnight"},{cell:"h1",piece:"whiteRook"},{cell:"a2",piece:"whitePawn"},{cell:"b2",piece:"whitePawn"},{cell:"c2",piece:"whitePawn"},{cell:"d2",piece:"whitePawn"},{cell:"e5",piece:"whitePawn"},{cell:"f2",piece:"whitePawn"},{cell:"g2",piece:"whitePawn"},{cell:"h2",piece:"whitePawn"}],imgNames:{blackQueen:"./chess/black-queen.svg",blackKing:"./chess/black-king.svg",blackBishop:"./chess/black-bishop.svg",blackKnight:"./chess/black-knight.svg",blackRook:"./chess/black-rook.svg",blackPawn:"./chess/black-pawn.svg",whiteQueen:"./chess/white-queen.svg",whiteKing:"./chess/white-king.svg",whiteBishop:"./chess/white-bishop.svg",whiteKnight:"./chess/white-knight.svg",whiteRook:"./chess/white-rook.svg",whitePawn:"./chess/white-pawn.svg"},createFunctions:{blackQueen:function(e){return new a.Queen(e,c.color.black)},blackKing:function(e){return new i.King(e,c.color.black)},blackBishop:function(e){return new n.Bishop(e,c.color.black)},blackKnight:function(e){return new s.Knight(e,c.color.black)},blackRook:function(e){return new l.Rook(e,c.color.black)},blackPawn:function(e){return new r.Pawn(e,c.color.black)},whiteQueen:function(e){return new a.Queen(e,c.color.white)},whiteKing:function(e){return new i.King(e,c.color.white)},whiteBishop:function(e){return new n.Bishop(e,c.color.white)},whiteKnight:function(e){return new s.Knight(e,c.color.white)},whiteRook:function(e){return new l.Rook(e,c.color.white)},whitePawn:function(e){return new r.Pawn(e,c.color.white)}},isWhiteFromBelow:!0,passantCell:{positiveIncrement:4,negativeIncrement:3},startPage:"#/Lobby"}},650:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.cellCoordinatesToName=void 0,t.cellCoordinatesToName=function(e){return String.fromCharCode(e.X+97)+String(e.Y+1)}},836:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.cellNameToCellPosition=void 0,t.cellNameToCellPosition=function(e){var t=e.charCodeAt(0);return 63-(8*(Number(e[1])-1)+Math.abs(t-104))}},175:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.cellNameToCoordinates=void 0,t.cellNameToCoordinates=function(e){return{X:e.charCodeAt(0)-97,Y:Number(e[1])-1}}},735:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createElement=void 0,t.createElement=function(e){var t,o=document.createElement("div");return(t=o.classList).add.apply(t,e),o}}},o={};function n(e){var i=o[e];if(void 0!==i)return i.exports;var s=o[e]={exports:{}};return t[e].call(s.exports,s,s.exports,n),s.exports}n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},e=new(n(77).App)(document.body),window.addEventListener("load",(function(){e.router.changeRoute()})),window.addEventListener("hashchange",(function(){e.router.changeRoute()}))})();