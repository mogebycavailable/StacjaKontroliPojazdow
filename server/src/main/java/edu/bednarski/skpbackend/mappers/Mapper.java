package edu.bednarski.skpbackend.mappers;

import java.text.ParseException;

public interface Mapper<A,B> {

    B mapTo(A a);

    A mapFrom(B b);

}
