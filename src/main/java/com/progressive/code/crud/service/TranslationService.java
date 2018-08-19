package com.progressive.code.crud.service;

import java.util.Arrays;
import java.util.Map;
import java.util.List;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.ResourceBundle;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class TranslationService {

    @Value("${supported.languages}")
    private String[] supportedLanguages;

    private static String translatedMessage;

    private static Map<Locale, Map<String, String>> lookup = new HashMap<>();

    public Map<Locale, Map<String, String>> getLookup() {
        return lookup;
    }

    @PostConstruct
    public void init() {
        Arrays.stream(supportedLanguages).forEach(this::initializeTranslations);
    }

    @Async
    public void getMessageTranslationAsync(String key, Locale locale) throws ExecutionException {
        ResourceBundle bundle = ResourceBundle.getBundle("messages", locale);
        AsyncResult result = new AsyncResult<>(bundle.getString(key));
        translatedMessage = (String) result.get();
    }

    public String getTranslatedMessage() {
        return translatedMessage;
    }

    private List<String> getResourceList(final String resource, final Locale locale) {
        return lookup.get(locale).entrySet().stream().filter(entry -> entry.getKey().contains(resource))
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }

    private void initializeTranslations(String language) {
        Locale locale = new Locale(language);
        ResourceBundle bundle = ResourceBundle.getBundle("messages", locale);
        Enumeration<String> bundleKeys = bundle.getKeys();
        Map<String, String> translatedMap = new HashMap<>();
        while (bundleKeys.hasMoreElements()) {
            String key = bundleKeys.nextElement();
            translatedMap.put(key, bundle.getString(key));
        }
        lookup.put(locale, translatedMap);
    }
}
