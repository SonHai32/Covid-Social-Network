import { Store } from '@ngrx/store';
import { LoadingActions } from './../app-loading/loading.actions';
import { ErrorActions } from './../error/error.actions';
import { AuthActions } from './auth.action';
import { AuthWithFirebaseService } from './../../services/auth/auth-with-firebase.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  map,
  catchError,
  exhaustMap,
  timeout,
  timeoutWith,
  tap,
  switchMap,
} from 'rxjs/operators';
import { iif, merge, of } from 'rxjs';
import firebase from 'firebase';
import { User } from '../../models/user.model';

@Injectable()
export class AuthEffects {
  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.CheckAuth),
      tap(() => this.store.dispatch(LoadingActions.SetLoading())),
      switchMap(() => this.authService.checkAuth()),
      tap(() => this.store.dispatch(LoadingActions.ClearLoading())),
      map((user: User) => AuthActions.AuthSuccess({ user })),
      catchError((err) =>
        of(
          ErrorActions.SetError({ errorMessage: err.message }) &&
            LoadingActions.ClearLoading()
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Login),
      exhaustMap((action) =>
        this.authService.loginWithEmailAndPassword(action.userCredentials).pipe(
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

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Logout),
      tap(() => this.store.dispatch(LoadingActions.SetLoading())),
      switchMap(() => this.authService.logOut()),
      map(() => AuthActions.LogoutSuccess()),
      tap(() => this.store.dispatch(LoadingActions.ClearLoading())),
      catchError((err) =>
        of(ErrorActions.SetError({ errorMessage: err.message }))
      )
    )
  );

  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LoginWithPopup),
      exhaustMap((action) =>
        this.authService.signInWithPopup(action.popupType).pipe(
          timeout(60000),
          map((user: User) => AuthActions.AuthSuccess({ user })),
          catchError((err) =>
            merge(
              of(
                AuthActions.AuthFail({
                  errorMessage: 'Lỗi quá thời gian kết nối',
                })
              ),
              of(
                ErrorActions.SetError({
                  errorMessage: err.message,
                })
              )
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthWithFirebaseService,
    private store: Store
  ) {}
}
