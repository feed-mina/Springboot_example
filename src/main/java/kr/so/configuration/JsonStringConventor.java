package kr.so.configuration;

import java.util.Map;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JsonStringConventor implements Converter<String, Map<String, Object>>{
    ObjectMapper objectMapper;
    public JsonStringConventor(ObjectMapper objectMapper){
        this.objectMapper = objectMapper;
    }

    // @RequestParmam 일때만 이 부분이 태워진다. (http://host?paramMap={a:1,b:2})

    @Override
    public Map<String, Object> convert(String value){
        try{
            return objectMapper.readValue(value, new TypeReference<Map<String, Object>>(){});
        }catch(JsonProcessingException e){
            e.printStackTrace();
        }
        return null;
    }
    
}
