import { AfterViewInit, Component, ElementRef, OnChanges, inject, input, viewChild } from '@angular/core';

/* Local drop-in component replicating the abandoned ngx-barcode's public API,
   built on jsbarcode (its original engine). Supports the [bc-*] binding style
   this app's templates already use. */

const BARCODE_FORMATS = [
  'CODE128', 'CODE128A', 'CODE128B', 'CODE128C',
  'EAN', 'EAN8', 'EAN5', 'EAN2', 'UPC',
  'CODE39', 'ITF14', 'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
  'pharmacode', 'codabar',
] as const;

@Component({
    selector: 'ngx-barcode',
    template: `
    <svg #bcElement class="barcode" [attr.data-barscan]="bcValue()"></svg>
  `,
    styleUrls: []
})
export class NgxBarcodeComponent implements OnChanges, AfterViewInit {
  private _el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly bcFormat = input<string>('CODE128', { alias: "bc-format" });
  readonly bcValue = input<string>('', { alias: "bc-value" });
  readonly bcDisplayValue = input(true, { alias: "bc-display-value" });
  readonly bcLineColor = input('#000000', { alias: "bc-line-color" });
  readonly bcWidth = input(2, { alias: "bc-width" });
  readonly bcHeight = input(100, { alias: "bc-height" });
  readonly bcFontSize = input(20, { alias: "bc-font-size" });
  readonly bcTextAlign = input('center', { alias: "bc-text-align" });
  readonly bcTextPosition = input('bottom', { alias: "bc-text-position" });
  readonly bcMargin = input(10, { alias: "bc-margin" });
  readonly bcBackground = input('#ffffff', { alias: "bc-background" });

  readonly bcElementRef = viewChild.required<ElementRef<SVGElement>>('bcElement');

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    const host = this._el.nativeElement;
    const bcFormat = this.bcFormat();
    const format = (BARCODE_FORMATS as readonly string[]).includes(bcFormat)
      ? bcFormat
      : 'CODE128';
    const svg = this.bcElementRef()?.nativeElement;
    if (!svg) {
      return;
    }
    const options: Record<string, unknown> = {
      format,
      displayValue: this.bcDisplayValue(),
      lineColor: this.bcLineColor(),
      width: this.bcWidth(),
      height: this.bcHeight(),
      fontSize: this.bcFontSize(),
      textAlign: this.bcTextAlign(),
      textPosition: this.bcTextPosition(),
      margin: this.bcMargin(),
      background: this.bcBackground(),
    };
    DynamicRenderer.render(svg as unknown as HTMLCanvasElement | SVGElement, this.bcValue(), options);
  }
}

/* Avoids importing renderer types; jsbarcode operates on nodes. */
const DynamicRenderer: { render: (el: unknown, value: string, opts: Record<string, unknown>) => void } = {
  render: (el, value, opts) => {
    const PrintOpts = { ...opts, width: opts.width as number };
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const JsBarcode = require('jsbarcode');
    try {
      JsBarcode(el, value, PrintOpts);
    } catch {
      /* barcode not valid for selected format — leave element blank */
    }
  },
};
