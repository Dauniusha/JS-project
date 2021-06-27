import { Game } from "./components/game/game";

const chess = new Game();
document.body.appendChild(chess.getChessBoard().element);
