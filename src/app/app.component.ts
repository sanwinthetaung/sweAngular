import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeBg from '@angular/common/locales/zh';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sweAngular';
  public languages = ['en', 'zh'];
  public selectedLanguage: string = 'en';

  constructor(public translate: TranslateService) {
    registerLocaleData(localeEn, 'en');
    registerLocaleData(localeBg, 'zh');
  }

  switchLang(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
  }
}
