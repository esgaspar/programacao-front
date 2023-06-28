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

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgForm } from '@angular/forms';
import { BasicAuthHtppInterceptorService } from './security/service/basic-auth-htpp-interceptor.service';
import { LoginComponent } from './login/login.component';




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
    LoginComponent
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
    NgxPrintModule, MatAutocompleteModule

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }, DatePipe, {
    provide: HTTP_INTERCEPTORS, useClass: BasicAuthHtppInterceptorService, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
