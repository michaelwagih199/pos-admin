import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

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
    <svg #bcElement class="barcode" [attr.data-barscan]="bcValue"></svg>
  `,
    styleUrls: [],
    standalone: false
})
export class NgxBarcodeComponent implements OnChanges, AfterViewInit {
  @Input('bc-format') bcFormat: string = 'CODE128';
  @Input('bc-value') bcValue: string = '';
  @Input('bc-display-value') bcDisplayValue = true;
  @Input('bc-line-color') bcLineColor = '#000000';
  @Input('bc-width') bcWidth = 2;
  @Input('bc-height') bcHeight = 100;
  @Input('bc-font-size') bcFontSize = 20;
  @Input('bc-text-align') bcTextAlign = 'center';
  @Input('bc-text-position') bcTextPosition = 'bottom';
  @Input('bc-margin') bcMargin = 10;
  @Input('bc-background') bcBackground = '#ffffff';

  @ViewChild('bcElement', { static: true }) bcElementRef!: ElementRef<SVGElement>;

  constructor(private _el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  private render(): void {
    const host = this._el.nativeElement;
    const format = (BARCODE_FORMATS as readonly string[]).includes(this.bcFormat)
      ? this.bcFormat
      : 'CODE128';
    const svg = this.bcElementRef?.nativeElement;
    if (!svg) {
      return;
    }
    const options: Record<string, unknown> = {
      format,
      displayValue: this.bcDisplayValue,
      lineColor: this.bcLineColor,
      width: this.bcWidth,
      height: this.bcHeight,
      fontSize: this.bcFontSize,
      textAlign: this.bcTextAlign,
      textPosition: this.bcTextPosition,
      margin: this.bcMargin,
      background: this.bcBackground,
    };
    DynamicRenderer.render(svg as unknown as HTMLCanvasElement | SVGElement, this.bcValue, options);
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
