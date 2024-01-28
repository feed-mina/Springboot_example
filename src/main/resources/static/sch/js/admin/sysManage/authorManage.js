var vueData = {
  cmmnCode : [],
  userAuth: "SA",
  userAuthNm: "관리자",
  userAuths: {}
};
var vm;

var vueInit = () => {
  const app = Vue.createApp({
    data() {
      return vueData;
    },
	mounted(){
		const userAuthor = util.getUrlParamJson().userAuthor || "SA"
		this.userAuth = userAuthor
	},
    methods: {
		fnAuthNm : (userAuth) => {
			location.href = "authorManage.html?userAuthor=" + userAuth
		},

		updtAuth : (key, val) => {
			var data = {	
				"userAuthor": vm.userAuth,
				"authorKey": key, // authorKey,
				"authorYn": val ? "Y" : "N"
			}
			console.log("🚀 ~ vueInit ~ rr:", data);

			$.sendAjax({
				url: "/sysManage/updateMberAuth.api",
				data: data,
				contentType: "application/json",
				success : (res) => {
					event.getAuthList();
				}			
			})
		}
    }
  })
  vm = app.mount("#content");
};

let event = {
	init:()=>{
	
	},
	getAuthList: () =>{
		$.sendAjax({
			url: "/sysManage/selectMberAuthList.api",
			data: {userAuthor: vm.userAuth},
			contentType: "application/json",
			success : (res) => {
				Object.keys(res.data).forEach(key => {
					res.data[key] = res.data[key] === "Y" 
				})
				vm.userAuths = res.data;
				console.log("🚀 ~ vm.userAuths :", vm.userAuths );
			}			
		})
	}
}

$(document).ready(() => {
  vueInit();
  event.init();

  const userAuthor = util.getUrlParamJson().userAuthor || "SA"
  vm.userAuth = userAuthor
  if(userAuthor === "SA"){
	vm.userAuthNm = "관리자"
  }else if(userAuthor === "PR"){
	vm.userAuthNm = "교수"
  }else{
	vm.userAuthNm = "알파"
  }

  event.getAuthList();
});