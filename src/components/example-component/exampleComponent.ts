/* eslint-disable @typescript-eslint/unbound-method */
import { html, css, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

export default class ExampleComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @state() stateElement = 'this is a state property';

  @property({ type: String }) set props(value: string) {
    this.stateElement = value;
  }
  render(): TemplateResult<1> {
    return html`
      <div>
        <span> this component displays: ${this.stateElement} </span>
        <slot></slot>
      </div>
    `;
  }
}
