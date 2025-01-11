package edu.bednarski.skpbackend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "stands")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class StandEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "stand",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<BookedTimeEntity> bookedTimes;

}
