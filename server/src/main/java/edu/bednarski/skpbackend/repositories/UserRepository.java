package edu.bednarski.skpbackend.repositories;

import edu.bednarski.skpbackend.domain.entities.UserEntity;
import edu.bednarski.skpbackend.security.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    UserEntity deleteByEmail(String email);

    List<UserEntity> findByRole(Role role);

}
