package edu.bednarski.skpbackend;

import edu.bednarski.skpbackend.config.DefaultWorkWeekConfig;
import edu.bednarski.skpbackend.config.RootConfig;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.WorkWeekTemplateDto;
import edu.bednarski.skpbackend.domain.entities.WorkWeekTemplateEntity;
import edu.bednarski.skpbackend.domain.enums.WeekDay;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.AppDatetimeFormatterService;
import edu.bednarski.skpbackend.services.AuthenticationService;
import edu.bednarski.skpbackend.services.WorkWeekTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
@Log
public class SkpbackendApplication implements CommandLineRunner {

	private final AuthenticationService authenticationService;

	private final UserRepository userRepository;

	private final UserDetailsDto rootAccount;

	private final WorkWeekTemplateService weekTemplateService;

	private final DefaultWorkWeekConfig weekConfig;

	private final AppDatetimeFormatterService timeFormatterService;

	public SkpbackendApplication(AuthenticationService authenticationService,
								 UserRepository userRepository,
								 RootConfig rootConfig,
								 WorkWeekTemplateService weekTemplateService,
								 DefaultWorkWeekConfig weekConfig,
								 AppDatetimeFormatterService timeFormatterService) {
		this.authenticationService = authenticationService;
		this.userRepository = userRepository;
		this.rootAccount = rootConfig.buildRootUser();
		this.weekTemplateService=weekTemplateService;
		this.weekConfig = weekConfig;
		this.timeFormatterService = timeFormatterService;
	}


	public static void main(String[] args) {
		SpringApplication.run(SkpbackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if(userRepository.findByEmail("root@skp.pl").isEmpty()) {
			log.info("Aplikacja uruchamia sie pierwszy raz.");
			log.info("Uwtorzono konto root'a z nastepujacymi danymi:");
			log.info(String.format("\tE-mail: %s",rootAccount.getEmail()));
			log.info(String.format("\tHaslo: %s",rootAccount.getPwdHash()));
			authenticationService.registerAdmin(rootAccount);
		}
		if(weekTemplateService.findAll().size() != 7) {
			while(weekTemplateService.findAll().size() > 0) {
				Optional<WorkWeekTemplateDto> first = weekTemplateService.findAll().stream().findFirst();
				first.ifPresent(workWeekTemplateDto -> weekTemplateService.delete(workWeekTemplateDto.getWeekDay()));
			}
			log.info("Nie znaleziono w bazie danych domyslnej konfiguracji roboczych dni tygodnia.");
			log.info("Utworzono domyslna konfiguracje tygodnia pracy:");
			List<WorkWeekTemplateDto> workWeek = new ArrayList<>();
			workWeek.add(new WorkWeekTemplateDto(WeekDay.MONDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getMonday()));
			workWeek.add(new WorkWeekTemplateDto(WeekDay.TUESDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getTuesday()));
			workWeek.add(new WorkWeekTemplateDto(WeekDay.WEDNESDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getWednesday()));
			workWeek.add(new WorkWeekTemplateDto(WeekDay.THURSDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getThursday()));
			workWeek.add(new WorkWeekTemplateDto(WeekDay.FRIDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getFriday()));
			workWeek.add(new WorkWeekTemplateDto(WeekDay.SATURDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getSaturday()));
			workWeek.add(new WorkWeekTemplateDto(WeekDay.SUNDAY,weekConfig.getStart(),weekConfig.getEnd(),!weekConfig.getSunday()));
			for(WorkWeekTemplateDto day : workWeek) {
				Optional<WorkWeekTemplateDto> createdDay = weekTemplateService.create(day);
				if(createdDay.isPresent()) {
					String message;
					if(!createdDay.get().getIsWorkFree())
						message = String.format("\t - %s, dzien wolny: NIE, poczatek pracy %s, koniec pracy %s",
								createdDay.get().getWeekDay(),
								createdDay.get().getWorkStart(),
								createdDay.get().getWorkEnd());
					else {
						message = String.format("\t - %s, dzien wolny: TAK",createdDay.get().getWeekDay());
					}
					log.info(message);
				}
				else throw new RuntimeException("Aplikacja nie mogla wystartowac. Wystapil fatalny blad przy dodawaniu domyslnej konfiguracji dni tygodnia.");
			}
		}
	}
}
