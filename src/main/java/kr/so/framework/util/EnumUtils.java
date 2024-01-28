package kr.so.framework.util;

import org.apache.commons.lang3.ObjectUtils;

import kr.so.util.BaseCodeLabelEnum;
	
public class EnumUtils {

	public static boolean isSelected(BaseCodeLabelEnum[] values, BaseCodeLabelEnum codeEnum) {
		if(ObjectUtils.isEmpty(values)) {
			return false;
		}
		for (BaseCodeLabelEnum value : values) {
			// 동일하면
			if(value.code().equals(codeEnum.code())) {
				return true;
			}
		}
		
		return false;
	}
}
