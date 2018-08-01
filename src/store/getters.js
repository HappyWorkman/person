const getters = {
  // decorate: state => state.decorate,
  componentsCount: state => {
    var data = {};
    var tempc = Object.keys(state.decorate.components).map(component => {
      data[component] = 0;
    });

    state.decorate.cfg.map(item => {
      data[item.key] += 1;
    });
    return data;
  },
  user: state => state.user,
  currentDecorateId: state => state.decorate.currentId,
  sidebar: state => state.app.sidebar,
  token: state => state.user.token
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // roles: state => state.user.roles
};
export default getters;
