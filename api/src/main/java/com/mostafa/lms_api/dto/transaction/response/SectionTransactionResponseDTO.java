package com.mostafa.lms_api.dto.transaction.response;

import com.mostafa.lms_api.dto.file.FileResponseDTO;
import com.mostafa.lms_api.dto.video.VideoResponseDTO;

import java.util.List;


public record SectionTransactionResponseDTO(
        List<VideoResponseDTO> videos,
        List<FileResponseDTO> files
) {
}
