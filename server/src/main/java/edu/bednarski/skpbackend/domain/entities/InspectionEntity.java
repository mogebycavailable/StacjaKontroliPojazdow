package edu.bednarski.skpbackend.domain.entities;

import edu.bednarski.skpbackend.domain.enums.InspectionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "inspections")
public class InspectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InspectionStatus status;

    @OneToMany(mappedBy = "inspection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookedTimeEntity> reservedTimestamps;

    @ManyToOne(optional = false)
    @JoinColumn(name = "fk_vehicle")
    private VehicleEntity vehicle;

}
