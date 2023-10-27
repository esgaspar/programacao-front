import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';

import { DesignacaoComponent } from './designacao/designacao.component';
import { DesignacaoCreateComponent } from './designacao/pages/create/designacao.create.component';
import { PrivilegioComponent } from './privilegio/privilegio.component';
import { SnackComponent } from './snack/snack.component';
import { VoluntarioComponent } from './voluntario/voluntario.component';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';


import { MatTableModule } from '@angular/material/table';
import { NgxPrintModule } from 'ngx-print';

import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DatePipe } from '@angular/common';

import { JsonPipe, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTooltipModule } from '@angular/material/tooltip';


import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';


import {
  CdkDrag,
  CdkDragPlaceholder,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { LoginComponent } from './login/login.component';
import { BasicAuthHtppInterceptorService } from './security/service/basic-auth-htpp-interceptor.service';
import { UserComponent } from './user/user.component';


import { APP_BASE_HREF } from '@angular/common';
import { SettingChangeColorSchemeComponent } from './settings/setting-change-color-scheme/setting-change-color-scheme.component';


registerLocaleData(ptBr)

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    MenuComponent,
    PrivilegioComponent,
    VoluntarioComponent,
    DesignacaoComponent,
    DesignacaoCreateComponent,
    SnackComponent,
    LoginComponent,
    UserComponent,
    SettingChangeColorSchemeComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, MatMenuModule, MatIconModule,
    MatSidenavModule, MatFormFieldModule, MatSelectModule,
    MatToolbarModule, MatGridListModule, MatDividerModule, MatExpansionModule,
    MatListModule, MatCheckboxModule, MatTableModule,
    MatCardModule, MatDatepickerModule, MatNativeDateModule, FlexLayoutModule, FormsModule,
    MatInputModule, MatSnackBarModule,
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgxPrintModule, MatAutocompleteModule, CdkDrag,
    CdkDragPlaceholder,
    CdkDropList,
    MatTooltipModule,
    MatProgressBarModule,
    FontAwesomeModule

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }, DatePipe, {
    provide: HTTP_INTERCEPTORS, useClass: BasicAuthHtppInterceptorService, multi: true
  }, { provide: APP_BASE_HREF, useValue: '/app/voluntary' }],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(library: FaIconLibrary) {
    library.addIconPacks(
      fas, far, fab
    );
  }
}
