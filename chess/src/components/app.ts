import { Footer } from "./footer/footer";
import { Header } from "./header/header";
import { Lobby } from "./lobby/lobby";

export class App {
  private header: Header;

  private footer: Footer;

  private lobby: Lobby;

  constructor(private readonly rootElement: HTMLElement) {
    this.header = new Header();
    this.rootElement.appendChild(this.header.element);

    this.lobby = new Lobby();
    this.rootElement.appendChild(this.lobby.element);

    this.footer = new Footer();
    this.rootElement.appendChild(this.footer.element);
  }
}