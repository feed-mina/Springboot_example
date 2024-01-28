var vueData = {
	totalCount: 0,

	galleryList: [],
	searchData: {
		searchText: '',
		pageNo: 1,
		pageLength: 10,
	},
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;
var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			util: function(){
				return util
			},
			fnSearch: function(userAuthor) {
				this.searchData.pageNo = 1;
				event.getGalleryList();
			},
			fnDtail: (excrtSeq) => {
				location.href = "galleryDetail.html?excrtSeq=" + excrtSeq
			},
			fnGallaryKndCode: (gallaryKndCode) => {
				switch (gallaryKndCode) {
					case 'W': vm.galleryList.gallaryKndCode = '서예 체험';
						break;
					case 'T': vm.galleryList.gallaryKndCode = '차 체험';
						break;
					case 'C': vm.galleryList.gallaryKndCode = '도장 체험';
						break;
					case 'S': vm.galleryList.gallaryKndCode = '향 체험';
						break;
					default: vm.galleryList.gallaryKndCode = '';
				}
			}

		}
	})
	vm = app.mount("#content");

};
let event = {
	init: () => {
	}
	, getGalleryList: () => {
		$.sendAjax({
			url: "/experience/selectExtfcListPaging.api",
			data: vm.searchData,
			contentType: "application/json",
			success: (res) => {
				console.log(res.data.list)
				vm.totalCount = res.data.totalCount;
				vm.galleryList = res.data.list; 
		
				fnPaging(res.data.totalCount, dataPerPage, pageCount, res.data.pageNo, (selectPage) => {
					vm.searchData.pageNo = selectPage;
					event.getGalleryList();
				})
			}
			, error: function(e) {
				$.alert(e.responseJSON.message);
			}
		});
	}
};

$(document).ready(() => {
	vueInit();
	// util.tableSetting();
	event.getGalleryList();
});

