import { Component } from '@angular/core';
import { Arabic } from 'src/app/text';

/** Phase B (sale-screen-preview-restyle): 32px hotkey reference footer.
 *  Purely presentational — no interactions live here. */
@Component({
  selector: 'app-hotkey-bar',
  templateUrl: './hotkey-bar.component.html',
  styleUrl: './hotkey-bar.component.scss',
})
export class HotkeyBarComponent {
  arabic: Arabic = new Arabic();
}
