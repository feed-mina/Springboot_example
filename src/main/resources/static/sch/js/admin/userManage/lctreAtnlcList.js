var vueData = {
	userDetail :{},
	attendList : [],
	finishedList : [],
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			userOneAnFLctreList: () => {
				const urlParams = new URL(location.href).searchParams;
				let param = {
					userSeq : urlParams.get('userSeq')
				}
				$.sendAjax({
					url: "/userManage/selectUserOneAnFLctreList.api",
					data : param,
					contentType: "application/json",
					success : (res) => {
						vm.userDetail = res.data;
						if(res.data.attendList){
							vm.attendList = res.data.attendList;
							for(var i=0; i<res.data.attendList.length; i++){
								vm.attendList[i].lctreBeginDe = util.date.addDateDash(res.data.attendList[i].lctreBeginDe);
								vm.attendList[i].lctreEndDe = util.date.addDateDash(res.data.attendList[i].lctreEndDe);
							}
						}
						if(res.data.finishedList){
							vm.finishedList = res.data.finishedList;
							for(var i=0; i<res.data.finishedList.length; i++){
								vm.finishedList[i].lctreBeginDe = util.date.addDateDash(res.data.finishedList[i].lctreBeginDe);
								vm.finishedList[i].lctreEndDe = util.date.addDateDash(res.data.finishedList[i].lctreEndDe);
							}
						}
					}			
				})
			},
			fnLctreDetail: (lctreSeq) => {
				detailModal(lctreSeq)
			}
		}
	})
	vm = app.mount('#content');
}

let event = {
	
	
	
}


$(document).ready( () => {
	vueInit();
	vm.userOneAnFLctreList();
})

