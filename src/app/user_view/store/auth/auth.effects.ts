import { ErrorActions } from './../error/error.actions';
import { AuthActions } from './auth.action';
import { AuthWithFirebaseService } from './../../services/auth/auth-with-firebase.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { merge, of } from 'rxjs';
import firebase from 'firebase';
import { User } from '../../models/user.model';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Login),
      exhaustMap((action) =>
        this.authService.loginWithEmailAndPassword(action.userCredentials)
      ),
      map((user: User) => AuthActions.AuthSuccess({ user })),
      catchError((error: firebase.FirebaseError) =>
        of(AuthActions.AuthFail({ errorMessage: error.message }))
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Register),
      exhaustMap((action) =>
        this.authService
          .createuserwithemailandpassword(action.userCredentials)
          .pipe(
            map((user: User) => AuthActions.AuthSuccess({ user })),
            catchError((error: firebase.FirebaseError) =>
              merge(
                of(AuthActions.AuthFail({ errorMessage: error.message })),
                of(ErrorActions.SetError({ errorMessage: error.message }))
              )
            )
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthWithFirebaseService
  ) {}
}
