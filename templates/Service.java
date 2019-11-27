<% if (classObject) { %>

package <%= classObject.packageName %>.services;

import <%= classObject.packageName %>.models.<%= classObject.className %>;
import <%= classObject.packageName %>.repositories.<%= classObject.repositoryName %>;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins="*", allowedHeaders = "*", allowCredentials = "true")
public class <%= classObject.serviceName %> {

	@Autowired
	<%= classObject.repositoryName %> <%= classObject.repositoryVariable %>;

	@GetMapping("/api/<%= classObject.classLowerCaseName %>s")
	public List<<%= classObject.className %>> findAll<%= classObject.className %>s() {
		return <%= classObject.repositoryVariable %>.findAll();
	}

	@PostMapping("/api/<%= classObject.classLowerCaseName %>s")
	public List<<%= classObject.className %>> create<%= classObject.className %>(@RequestBody <%= classObject.className %> new<%= classObject.className %>) {

		new<%= classObject.className %> = <%= classObject.repositoryVariable %>.save(new<%= classObject.className %>);
		return <%= classObject.repositoryVariable %>.findAll();
	}

	@GetMapping("/api/<%= classObject.classLowerCaseName %>/{<%= classObject.classLowerCaseName %>Id}")
	public <%= classObject.className %> find<%= classObject.className %>ById(@PathVariable("<%= classObject.classLowerCaseName %>Id") int <%= classObject.classLowerCaseName %>Id) {
		return <%= classObject.repositoryVariable %>.findById(<%= classObject.classLowerCaseName %>Id);
	}

	@PutMapping("/api/<%= classObject.classLowerCaseName %>/{<%= classObject.classLowerCaseName %>Id}")
	public <%= classObject.className %> update<%= classObject.className %>(@PathVariable("<%= classObject.classLowerCaseName %>Id") int <%= classObject.classLowerCaseName %>Id, @RequestBody <%= classObject.className %> new<%= classObject.className %>) {

		<%= classObject.className %> <%= classObject.classLowerCaseName %>ToUpdate = <%= classObject.repositoryVariable %>.findById(<%= classObject.classLowerCaseName %>Id);
		<%= classObject.classLowerCaseName %>ToUpdate = <%= classObject.repositoryVariable %>.save(<%= classObject.classLowerCaseName %>ToUpdate);
		return <%= classObject.repositoryVariable %>.findById(<%= classObject.classLowerCaseName %>Id);
	}

	@DeleteMapping("/api/<%= classObject.classLowerCaseName %>/{<%= classObject.classLowerCaseName %>Id}")
	public List<<%= classObject.className %>> delete<%= classObject.className %>(@PathVariable("<%= classObject.classLowerCaseName %>Id") int <%= classObject.classLowerCaseName %>Id) {

		<%= classObject.repositoryVariable %>.deleteById(<%= classObject.classLowerCaseName %>Id);
		return <%= classObject.repositoryVariable %>.findAll();
	}
}

            <% } %>

