var vueData = {
	userDetail :{}
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			fnLctUpdtMov : () => {
				if(vm.userDetail.lctCnt === 0){
					$.alert("신청중인 강의가 없습니다.")
					return false
				}
				location.href="lctreAtnlcUpdt.html?userSeq=" + vm.userDetail.userSeq
			},
			fnSmnUpdtMov : () => {
				if(vm.userDetail.smnCnt === 0){
					$.alert("신청중인 세미나가 없습니다.")
					return false
				}
				location.href="seminaAtnlcUpdt.html?userSeq=" + vm.userDetail.userSeq
			},
			fnLctListMov : () => {
				location.href="lctreAtnlcList.html?userSeq=" + vm.userDetail.userSeq
			},
			fnSmnListMov : () => {
				location.href="seminaAtnlcList.html?userSeq=" + vm.userDetail.userSeq
			},
			fnUpdtMov : () => {
				location.href= "/sch/admin/sysManage/mberUpdt.html?userSeq=" + vm.userDetail.userSeq
			},
			userDetailOne: () => {
				const urlParams = new URL(location.href).searchParams;
				let param = {
					userSeq : urlParams.get('userSeq')
				}
				
				$.sendAjax({
					url: "/userManage/selectUserOneDetail.api",
					data : param,
					contentType: "application/json",
					success : (res) => {
						vm.userDetail = res.data;
						if(res.data.mbtlnum !== null){
						  vm.userDetail.mbtlnum = util.formmater.phone(res.data.mbtlnum);
					  }
					  
					  if(res.data.mktStplat){
						  var befMonth = new Date(res.data.mktStplat);
						  befMonth.setFullYear(befMonth.getFullYear()+5);
						  var now = new Date();
						  var mktUseAt = Math.floor((befMonth.getTime() - now.getTime())/(1000*60*60*24));
						  vm.userDetail.mktUseAt = mktUseAt;
					  }
					  if(res.data.psitnNm){
						  let psitnNm1 = res.data.psitnNm.split('/');
						  vm.userDetail.psitnNm1 = psitnNm1[0];
						  if(psitnNm1[1]){
							  vm.userDetail.psitnNm2 = psitnNm1[1];
						  }
					  }
					}			
				})
			}
		}
	})
	vm = app.mount('#content');
}

var event = {
	
	
}


$(document).ready( () => {
	vueInit();
	vm.userDetailOne();
})

