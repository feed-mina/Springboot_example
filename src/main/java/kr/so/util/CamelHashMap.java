package kr.so.util;

import java.util.LinkedHashMap;

import org.springframework.jdbc.support.JdbcUtils;

@SuppressWarnings("serial")
public class CamelHashMap extends LinkedHashMap<String, Object> {

	@Override
	public Object put(String key, Object value) {
		// _(underscore가 있는 경우만 camel 변경)
		if (!key.contains("_")) {
			return super.put(key, value);
		}

		return super.put(JdbcUtils.convertUnderscoreNameToPropertyName(key), value);
	}

}
