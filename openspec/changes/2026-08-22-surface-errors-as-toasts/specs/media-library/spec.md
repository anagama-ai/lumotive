## MODIFIED Requirements

### Requirement: Validate uploads at the trust boundary
The server MUST accept only JPEG, PNG, WebP, and GIF image uploads no larger than 10 MiB per file or 30 MiB per upload batch. The server MUST enforce the detected file type, individual file size, and batch size regardless of browser-side checks, and a rejected upload SHALL report the reason without creating a media item. The browser SHALL reject an oversized selection through the shared admin toast layer before sending a request, and a request-size rejection SHALL be rendered by the admin error boundary inside the admin shell rather than replacing the shell with a separate error page.

#### Scenario: Reject an unsupported file type
- **WHEN** an editor uploads a file whose detected type is not JPEG, PNG, WebP, or GIF
- **THEN** the upload SHALL be rejected with a message identifying the unsupported file type
- **AND** no media item SHALL be created

#### Scenario: Reject an oversized image
- **WHEN** an editor uploads an image larger than 10 MiB
- **THEN** the upload SHALL be rejected with a message identifying the maximum file size
- **AND** no media item SHALL be created

#### Scenario: Reject an oversized selection before a request
- **WHEN** an editor selects an image larger than 10 MiB or a batch larger than 30 MiB
- **THEN** the admin toast layer SHALL report the applicable limit
- **AND** no upload request SHALL be sent

#### Scenario: Report a request-size rejection inside the admin shell
- **WHEN** an upload request is rejected because its request body is too large
- **THEN** the admin error boundary SHALL report the rejection inside the admin shell
- **AND** the admin shell SHALL NOT be replaced with a separate error page
