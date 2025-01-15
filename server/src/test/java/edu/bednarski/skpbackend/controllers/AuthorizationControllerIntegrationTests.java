package edu.bednarski.skpbackend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.bednarski.skpbackend.TestDataUtil;
import edu.bednarski.skpbackend.domain.dto.UserDetailsDto;
import edu.bednarski.skpbackend.domain.dto.UserDto;
import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.repositories.UserRepository;
import edu.bednarski.skpbackend.services.AuthenticationService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc
public class AuthorizationControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthenticationService service;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    public void clearUsersTableInDatabase() {
        userRepository.deleteAll();
    }

    @Test
    public void testThatRegisterSuccessfullyReturnsHttp201Created() throws Exception {
        UserDetailsDto testUser = TestDataUtil.createTestUserDetailsDto();
        String registerJson = objectMapper.writeValueAsString(testUser);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson)
        ).andExpect(
                MockMvcResultMatchers.status().isCreated()
        );
    }

    @Test
    public void testThatRegisterUserAutomaticallyLogInCreatedUser() throws Exception {
        UserDetailsDto testUser = TestDataUtil.createTestUserDetailsDto();
        String registerJson = objectMapper.writeValueAsString(testUser);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson)
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.accessToken").isNotEmpty()
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.refreshToken").isNotEmpty()
        ).andExpect(
                MockMvcResultMatchers.jsonPath("$.role").value("ROLE_CLIENT")
        );
    }

    @Test
    public void testThatLoginOnExistingAccountSuccessfullyReturns200Ok() throws Exception {
        UserDetailsDto testUser = TestDataUtil.createTestUserDetailsDto();
        UserDto loginRequest = TestDataUtil.createTestLoginRequest(testUser);
        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);
        service.register(testUser);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson)
        ).andExpect(
                MockMvcResultMatchers.status().isOk()
        );
    }

    @Test
    public void testThatLoginOnNotExistingAccountReturns403Forbidden() throws Exception {
        UserDetailsDto testUser = TestDataUtil.createTestUserDetailsDto();
        UserDto loginRequest = TestDataUtil.createTestLoginRequest(testUser);
        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson)
        ).andExpect(
                MockMvcResultMatchers.status().isForbidden()
        );
    }

    @Test
    public void testThatRegistrationOnExistingEmailReturns400BadRequest() throws Exception {
        UserDetailsDto testUser = TestDataUtil.createTestUserDetailsDto();
        String registerRequestJson = objectMapper.writeValueAsString(testUser);
        service.register(testUser);
        mockMvc.perform(
                MockMvcRequestBuilders.post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerRequestJson)
        ).andExpect(
                MockMvcResultMatchers.status().isBadRequest()
        );
    }
}
