let seminaOneDetail = {}
function detailModal(seminaSeq){
	
	$.get("/sch/admin/userManage/seminaDetailModal.html", function (data) {
    $("#modalBody").html(data);
  })
  let param = {
		seminaSeq : seminaSeq
	}
  $.sendAjax({
		url: "/userManage/selectSeminaOneDetail.api",
		data : param,
		contentType: "application/json",
		success : (res) => {
			seminaOneDetail = res.data
			modalBind(seminaOneDetail);
		}
	})
}

function modalBind(seminaOneDetail){
	$("#seminaNm").text(seminaOneDetail.seminaNm)
	$("#seminaDeTm").text(util.addDateDot(seminaOneDetail.seminaDe) + " " + 
									util.cnTime(seminaOneDetail.seminaBeginTime) + " ~ " + util.cnTime(seminaOneDetail.seminaEndTime))
	$("#img").attr('src', seminaOneDetail.seminaImageCn)
	$("#prfImg").attr('src', seminaOneDetail.proflImageCn)
	$("#progrsUserNm").text(seminaOneDetail.progrsUserNm + " 교수님")
	//<br> => enter
	var progrsHist = seminaOneDetail.progrsHist
	
	if(util.emptyCheck(progrsHist) !== ''){
		progrsHist = progrsHist.split('<br>').join("\n");
	}else{
		progrsHist = '등록된 이력이 없습니다.'
	}
	
	$("#progrsHist").text(progrsHist)
	$("#seminaPlaceNm").text(seminaOneDetail.seminaPlaceNm)
	$("#seminaDc").text(seminaOneDetail.seminaDc)
	$("#seminaCn").text(seminaOneDetail.seminaCn)
}
