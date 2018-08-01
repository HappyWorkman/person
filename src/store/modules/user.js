import { login, logout, getInfo } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { Message, MessageBox } from 'element-ui';
import Cookies from 'js-cookie';

let cookieUser = {};
try {
  var userinfo = Cookies.get('userdata');
  if (userinfo) {
    cookieUser = JSON.parse(userinfo);
  }
} catch (e) {}
const user = {
  state: {
    token: getToken(),
    name: cookieUser.name || '',
    avatar: '',
    id: cookieUser.id || '',
    logo: cookieUser.logo || null,
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_USER_DATA: (state, data) => {
      state.id = data.id;
      state.name = data.name;
      state.logo = data.logo;

      Cookies.set('userdata', data);
    }
  },

  actions: {
    // 登录

    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return login(
        username,
        userInfo.password,
        userInfo.codenum,
        userInfo.clientId
      ).then(
        response => {
          const data = response.data;
          if (data.code === '-1') {
            throw new Error(data);
          } else {
            setToken(data.token);
            commit('SET_TOKEN', data.token);

            //店铺信息
            commit('SET_USER_DATA', data);
          }
          return response;
        },
        function(res) {
          var data = res.data;
          if (data.code === '-1') {
            Message({
              message: res.data,
              type: 'error',
              duration: 5 * 1000
            });
          }
        }
      );
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return getInfo(state.token).then(response => {
        const data = response.data;
        commit('SET_ROLES', data.role);
        commit('SET_NAME', data.name);
        commit('SET_AVATAR', data.avatar);
        return response;
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(res => {
            commit('SET_TOKEN', '');
            // commit('SET_ROLES', []);
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
