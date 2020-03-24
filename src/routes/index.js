import  LoginRouter from './authentication/login';
import  SignUpRouter from './authentication/signup';
import  StartRouter from './general/start';
import  EditProfileRouter from './authentication/editProfile';

const AppRoutes=(app)=>{
    app.use(LoginRouter.routePrefix,LoginRouter.route());
    app.use(SignUpRouter.routePrefix,SignUpRouter.route());
    app.use(StartRouter.routePrefix,StartRouter.route());
    app.use(EditProfileRouter.routePrefix,EditProfileRouter.route());
};
export default AppRoutes;
