import { Injectable } from '@angular/core';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import { AlertsService } from './alerts.service';
import { OAuthSettings } from '../oauth';
import { User } from './user';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticated = false;
  public user?: User = undefined;
  public graphClient?: Client;

  constructor(private msalService: MsalService, private alertsService: AlertsService) {
    const accounts = this.msalService.instance.getAllAccounts();
    this.authenticated = accounts.length > 0;
    if (this.authenticated) {
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
    this.getUser().then(user => this.user = user);
  }

  // Prompt the user to sign in
  async signIn(): Promise<void> {
    const result = await this.msalService
      .loginPopup(OAuthSettings)
      .toPromise()
      .catch(reason => {
        this.alertsService.addError('Login failed', JSON.stringify(reason, null, 2));
    });

    if (result) {
      this.msalService.instance.setActiveAccount(result.account);
      this.authenticated = true;
      this.user = await this.getUser();
    }
  }

  async signOut(): Promise<void> {
    await this.msalService.logout().toPromise();
    this.user = undefined;
    this.authenticated = false;
  }

  private async getUser(): Promise<User | undefined> {
    // Create an authentication provider for the current user
    const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
      this.msalService.instance as PublicClientApplication, {
        account: this.msalService.instance.getActiveAccount()!,
        scopes: OAuthSettings.scopes,
        interactionType: InteractionType.Popup
      }
    );

    // Initialize the Graph client
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider
    });

    // Get the user from Graph (GET /me)
    const graphUser: MicrosoftGraph.User = await this.graphClient
      .api('/me')
      .select('displayName,mail,mailboxSettings,userPrincipalName')
      .get();

    const user = new User();
    user.displayName = graphUser.displayName ?? '';
    // Perfer the mail property, but fall back to userPrincipalName
    user.email = graphUser.mail ?? graphUser.userPrincipalName ?? '';
    user.timeZone = graphUser.mailboxSettings?.timeZone ?? 'UTC';

    // Just use the default avatar
    user.avatar = '/assets/no-profile-photo.png';
    return user;
  }
}
