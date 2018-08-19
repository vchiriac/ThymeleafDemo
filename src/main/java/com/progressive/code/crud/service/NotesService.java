package com.progressive.code.crud.service;

import java.util.List;

import com.progressive.code.crud.domain.Notes;

public interface NotesService {

    List<Notes> findAll();

    Notes findOne(Long id);

    Notes saveNotes(Notes notes);

    void deleteNotes(Long id);

}
