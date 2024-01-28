package kr.so.configuration;
import javax.sql.DataSource;
import org.apache.catalina.core.ApplicationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.ibatis.session.SqlSessionFactory; 
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.core.io.Resource;
import org.apache.ibatis.session.SqlSession;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DatabaseConfiguration {

    @Autowired
    private ApplicationContext applicationContext;

    @Bean
    @ConfigurationProperties(prefix="spring.datasource.hikari")
    public HikariConfig hikariConfig(){
        return new HikariConfig();
    }

   @Bean(destroyMethod = "close")
    public HikariDataSource dataSource() throws Exception{
        HikariDataSource dataSource = new HikariDataSource(hikariConfig());
        return dataSource;
    } 
/*
	@Bean
	@ConfigurationProperties("spring.datasource.hikari")
	public DataSource dataSource() {
		return DataSourceBuilder.create().type(HikariDataSource.class).build();
	} */
 
@Bean
public SqlSessionFactory sqlSessionFactory() throws Exception{
    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
    // MyBatis 매퍼 파일이 위치한 패키지를 설정
    String packageScanPath = "classpath:kr/so/mapper/*.xml"; 

    // PathMatchingResourcePatternResolver를 사용하여 매퍼 파일의 위치를 해결 
    Resource resources = new PathMatchingResourcePatternResolver().getResource(packageScanPath);

    // 해결된 매퍼 파일의 위치를 설정
   // sqlSessionFactoryBean.setDataSource(dataSource());
    sqlSessionFactoryBean.setMapperLocations(resources);
    sqlSessionFactoryBean.setConfigLocation(new PathMatchingResourcePatternResolver().getResource("classpath:/mybatis-config.xml"));
    return sqlSessionFactoryBean.getObject();
}
// applicationContext.getResource("classpath:/mybatis-config.xml")
@Bean
public SqlSession sqlsession() throws Exception{
    return new SqlSessionTemplate(sqlSessionFactory());
}


/*
 * 
   @Bean
    public MappingMongoConverter mappingMongoConverter(
            MongoDatabaseFactory mongoDatabaseFactory,
            MongoMappingContext mongoMappingContext
    ) {
        DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDatabaseFactory);
        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
        return converter;
    }

 */

}

