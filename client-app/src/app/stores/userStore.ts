import { action, computed, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IUser,IUserFormValues} from './../models/user';
import { RootStore } from "./rootStore";
import { history } from '../..';

export default class UserStore {
  refreshTokenTimeOut :any;
    rootStore:RootStore;
    constructor(rootStore:RootStore){
      this.rootStore=rootStore;
    }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

    @action login = async (values: IUserFormValues) => {
        try{
            const user = await agent.User.login(values);
            runInAction(() => {
              this.user = user;              
            });           
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            this.rootStore.modalStore.closeModal();
            history.push('/activities')
        }catch(error){
            throw error;
        }
    };

    @action register =async(values:IUserFormValues) =>{
      try{
        const user=await agent.User.register(values);
        this.rootStore.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
        this.rootStore.modalStore.closeModal();
        history.push('/activities')
      }catch(error){
        throw error;
      }
    }

    @action refreshToken = async () => {
      this.stopRefreshTokenTimer();
      try{
          const user = await agent.User.refreshToken();
          runInAction(() => {
            this.user =user;
          })
          this.rootStore.commonStore.setToken(user.token);
          this.startRefreshTokenTimer(user);
      } catch(error) {
        console.log(error);
      }
    }

    @action getUser = async () => {
      try {
        const user = await agent.User.current();
        runInAction(() => {
          this.user = user;
        });
        this.rootStore.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
      } catch (error) {
        console.log(error);
      }
    };

    @action logout = () =>{
      this.rootStore.commonStore.setToken(null);
      this.user=null;
      history.push('/')
    }

    private startRefreshTokenTimer(user: IUser){
      const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60*1000);
      this.refreshTokenTimeOut =setTimeout(this.refreshToken,timeout);
    }

    private stopRefreshTokenTimer(){
      clearTimeout(this.refreshTokenTimeOut);
    }
}