import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/core/models/user.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { IMessage } from 'src/app/core/models/message.model';
import { AuthService } from 'src/app/core/services/auth.service';
import {ICommunaute} from '../../core/models/communaute.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-communaute',
  templateUrl: './communaute.component.html',
  styleUrls: ['./communaute.component.css']
})
export class CommunauteComponent implements OnInit {
  public users: Observable<IUser[]>;
  public messages: Observable<IMessage[]>;
  public message = '';

  public headElements = ['Rang', 'Pseudo', 'Points'];
  public displayedColumns: string[] = ['rang', 'pseudo', 'points'];

  constructor(
    private firestore: AngularFirestore,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.firestore.collection<ICommunaute>('communaute', (ref) =>
        ref.where('emails', 'array-contains', user.email)
      ).valueChanges().subscribe((communautes) => {
        if (communautes.length === 0) {
          this.router.navigateByUrl('/communaute/creation-communaute');
        }
      });
    });

    this.users = this.firestore
      .collection<IUser>('users')
      .snapshotChanges()
      .pipe(
        map((e) => {
          return this.trier(
            e.map((r) => {
              return { id: r.payload.doc.id, ...r.payload.doc.data() };
            })
          );
        })
      );

    this.messages = this.chatService.getMessages().pipe(
      map((messages) => {
        // Inverser l'ordre des messages
        return messages.reverse();
      })
    );
  }


  public trier(tableau: IUser[]): IUser[] {
    tableau.sort((a, b) => {
      return b.points - a.points;
    });
    let rangCompteur = 1;
    for (let i = 0; i < tableau.length; i++) {
      if (i !== 0) {
        if (tableau[i].points !== tableau[i - 1].points) {
          tableau[i].rang = '' + rangCompteur;
        } else {
          tableau[i].rang = '-';
        }
      } else {
        tableau[i].rang = '' + rangCompteur;
      }
      rangCompteur += 1;
    }
    return tableau;
  }

  public sendMessage(): void {
    const date = new Date();
    this.authService.user.subscribe((user) => {
      const nom = user.email || 'anonyme';
      const chatBox = document.querySelector('.chat-box .message-list');
      const atBottom = chatBox
        ? chatBox.scrollTop === chatBox.scrollHeight - chatBox.clientHeight
        : false;
      if (!atBottom && chatBox) {
        chatBox.scrollTo(0, chatBox.scrollHeight);
      }
      setTimeout(() => {
        this.chatService
          .addMessage(nom, this.message, date)
          .then(() => {
            this.message = ''; // réinitialiser la valeur de message après l'envoi réussi
            if (chatBox) {
              chatBox.scrollTo(0, chatBox.scrollHeight);
            }
          })
          .catch((error) => {});
      }, 50);
    });
  }
}
