var vueData = {
	userDetail :{},
	seminaList : [],
	seminaCnclList : [],
	seminaCnclUpdt : {},
	btnRe : false
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			userOneSeminaList: () => {
				const urlParams = new URL(location.href).searchParams;
				let param = {
					userSeq : urlParams.get('userSeq')
				}
				$.sendAjax({
					url: "/userManage/selectUserOneSeminaList.api",
					data : param,
					contentType: "application/json",
					success : (res) => {
						vm.userDetail = res.data;
						if(res.data.seminaList){
							vm.seminaList = res.data.seminaList;
							for(var i=0; i<res.data.seminaList.length; i++){
								vm.seminaList[i].seminaDe = util.date.addDateDash(res.data.seminaList[i].seminaDe);
								vm.seminaList[i].seminaBeginTime = util.cnTime(res.data.seminaList[i].seminaBeginTime);
								vm.seminaList[i].seminaEndTime = util.cnTime(res.data.seminaList[i].seminaEndTime);
							}
						}
					}			
				})
			},
			fnSeminaCncl: (seminaSeq, idx) => {
				vm.seminaCnclList.push(seminaSeq);
				$('#cnclAdd'+idx).hide();
				$('#cnclRe'+idx).show();
			},
			fnSeminaRe: (seminaSeq, idx) => {
				for(let i = 0; i < vm.seminaCnclList.length; i++) {
			    if (vm.seminaCnclList[i] === seminaSeq) {
						vm.seminaCnclList.splice(i, 1);
						i--
			    }
				}
				$('#cnclAdd'+idx).show();
				$('#cnclRe'+idx).hide();
			},
			fnSeminaReset: () => {
				if(vm.seminaCnclList.length === 0){
					$.alert("신청 취소할 목록이 없습니다.")
				}
				if(vm.seminaCnclList.length > 0){
					$.confirm("신청 취소할 목록을 초기화 하시겠습니까?", () => {
						vm.seminaCnclList = []
						$('.cnclAdd').show()
						$('.cnclRe').hide()
					})
				}
			},
			fnSeminaCnclUpdt:() => {
				$.confirm("정말 신청 취소를 저장하시겠습니까? 저장 이후에는 변경이 되지 않습니다.", ()=> {
					if(!vm.seminaCnclList.length){
						$.alert("신청 취소할 강의를 선택해 주세요.");
						return false;
					}
					
					let param = {
						userSeq : vm.userDetail.userSeq,
						seminaCnclList : vm.seminaCnclList
					}
					$.sendAjax({
						url: "/userManage/updateSeminaCancl.api",
						data : param,
						contentType: "application/json",
						success : (res) => {
							$.confirm("저장이 완료되었습니다.", () =>{
								location.href="userDetail.html?userSeq=" + vm.userDetail.userSeq
							})
						}			
					})
				})
			},
			fnSeminaDetail: (seminaSeq) => {
				detailModal(seminaSeq)
			}
		}
	})
	vm = app.mount('#content');
}

var event = {
	
	
}


$(document).ready( () => {
	vueInit();
	vm.userOneSeminaList();
})

