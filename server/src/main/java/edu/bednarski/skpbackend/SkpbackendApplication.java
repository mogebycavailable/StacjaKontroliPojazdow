package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.repositories.UserRepository;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Log
public class SkpbackendApplication implements CommandLineRunner {

	private UserRepository userRepository;

	public SkpbackendApplication(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public static void main(String[] args) {
		SpringApplication.run(SkpbackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if(userRepository.findByEmail("root@skp.pl")==null) {
			UserEntity userEntity = UserEntity
					.builder()
					.email("root@skp.pl")
					.pwdHash("root")
					.build();
			userRepository.save(userEntity);
			log.info("Aplikacja uruchamia sie pierwszy raz.");
			log.info("Uwtorzono konto root'a z nastepujacymi danymi:");
			log.info("\tE-mail: root@skp.pl");
			log.info("\tHaslo: root");
		}
	}
}
